-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    published BOOLEAN DEFAULT false
);

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create blog_reactions table
CREATE TABLE IF NOT EXISTS public.blog_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Create blog_replies table
CREATE TABLE IF NOT EXISTS public.blog_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID NOT NULL REFERENCES public.blog_comments(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
    FOR SELECT USING (published = true);

CREATE POLICY "Only admins can create blog posts" ON public.blog_posts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profile 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

CREATE POLICY "Only admins can update their own blog posts" ON public.blog_posts
    FOR UPDATE USING (
        author_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.user_profile 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

CREATE POLICY "Only admins can delete blog posts" ON public.blog_posts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_profile 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- RLS Policies for blog_comments
CREATE POLICY "Anyone can view comments on published posts" ON public.blog_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.blog_posts 
            WHERE id = post_id AND published = true
        )
    );

CREATE POLICY "Authenticated users can create comments" ON public.blog_comments
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" ON public.blog_comments
    FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Users can delete their own comments or admins can delete any" ON public.blog_comments
    FOR DELETE USING (
        author_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.user_profile 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- RLS Policies for blog_reactions
CREATE POLICY "Anyone can view reactions on published posts" ON public.blog_reactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.blog_posts 
            WHERE id = post_id AND published = true
        )
    );

CREATE POLICY "Authenticated users can create reactions" ON public.blog_reactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reactions" ON public.blog_reactions
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reactions" ON public.blog_reactions
    FOR DELETE USING (user_id = auth.uid());

-- RLS Policies for blog_replies
CREATE POLICY "Anyone can view replies on published posts" ON public.blog_replies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.blog_comments c
            JOIN public.blog_posts p ON c.post_id = p.id
            WHERE c.id = comment_id AND p.published = true
        )
    );

CREATE POLICY "Only admins can create replies" ON public.blog_replies
    FOR INSERT WITH CHECK (
        auth.uid() = author_id AND
        EXISTS (
            SELECT 1 FROM public.user_profile 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

CREATE POLICY "Only admins can update their own replies" ON public.blog_replies
    FOR UPDATE USING (
        author_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.user_profile 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

CREATE POLICY "Only admins can delete replies" ON public.blog_replies
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_profile 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_created_at ON public.blog_posts(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON public.blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_reactions_post_id ON public.blog_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_reactions_user_post ON public.blog_reactions(user_id, post_id);
CREATE INDEX IF NOT EXISTS idx_blog_replies_comment_id ON public.blog_replies(comment_id);
