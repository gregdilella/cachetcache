<script lang="ts">
	import { page } from '$app/stores';
	import {
		RadioGroup,
		RadioItem,
		getDrawerStore,
		type DrawerSettings
	} from '@skeletonlabs/skeleton';
	import { Syringe, Mail, User } from 'lucide-svelte';

	let value: number = 0; // Activating the different elements in the Nav
	$: if ($page.url.pathname === '/welcome') {
		value = 0;
	} else if ($page.url.pathname === '/services') {
		value = 1;
	} else if ($page.url.pathname === '/about') {
		value = 2;
	} else if ($page.url.pathname === '/contact') {
		value = 3;
	} else if ($page.url.pathname === '/signin') {
		value = 4;
	} else if ($page.url.pathname === '/signup') {
		value = 4;
	}

	const drawerStore = getDrawerStore();

	const navSettings: DrawerSettings = {
		id: 'nav',
		position: 'top',
		bgDrawer: 'bg-surface-200-700-token',
		border: 'border-surface-400-500-token border',
		height: 'h-auto',
		padding: 'p-4',
		rounded: 'rounded-token',
		width: 'w-auto',
		regionDrawer: 'mx-auto'
	};
</script>

<RadioGroup
	class="flex md:flex-col p-2 md:-translate-y-1/2 md:left-6 max-md:menu-xs bg-gradient-to-br from-pink-100 to-purple-100 border-pink-300 border-2 rounded-box fixed md:top-1/2 max-md:bottom-6 max-md:left-1/2 max-md:-translate-x-1/2 transform z-10 text-pink-700 shadow-md"
>
	<a href="/welcome" class="flex justify-center">
		<RadioItem
			bind:group={value}
			name="welcome"
			value={0}
			class="my-auto flex aspect-square justify-center rounded-full text-xl hover:bg-pink-200"
		>
			<i class="fa-solid fa-house m-auto"></i>
		</RadioItem>
	</a>
	<a href="/services" class="flex justify-center">
		<RadioItem
			bind:group={value}
			name="services"
			value={1}
			class="my-auto flex aspect-square justify-center rounded-full text-xl hover:bg-pink-200"
		>
			<Syringe class="m-auto w-6 h-6" />
		</RadioItem>
	</a>
	<a href="/about" class="flex justify-center">
		<RadioItem
			bind:group={value}
			name="about"
			value={2}
			class="my-auto flex aspect-square justify-center rounded-full text-xl hover:bg-pink-200"
		>
			<i class="fa-solid fa-address-book m-auto"></i>
		</RadioItem>
	</a>
	<a href="/contact" class="flex justify-center">
		<RadioItem
			bind:group={value}
			name="contact"
			value={3}
			class="my-auto flex aspect-square justify-center rounded-full text-xl hover:bg-pink-200"
		>
			<Mail class="m-auto w-6 h-6" />
		</RadioItem>
	</a>

	<a href="/signin" class="flex justify-center">
		<RadioItem
			bind:group={value}
			name="signin"
			value={4}
			class="my-auto flex aspect-square justify-center rounded-full text-xl hover:bg-pink-200"
		>
			<User class="m-auto w-6 h-6" />
		</RadioItem>
	</a>



</RadioGroup>

