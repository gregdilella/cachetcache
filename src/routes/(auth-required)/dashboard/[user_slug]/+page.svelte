<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	$: userProfile = data.userProfile;
	$: user_slug = data.user_slug;

	let loading = false;
	let successMessage = '';
	let isEditing = false;

	// Form fields - ensure they reactively update when userProfile changes
	$: name = userProfile?.name || '';
	$: phoneNumber = userProfile?.phone_number || '';
	$: sex = userProfile?.sex || '';
	$: age = userProfile?.age || null;
	$: email = userProfile?.email || '';
	
	let dateOfBirth = '';

	// Convert age to approximate date of birth if available
	$: if (userProfile?.age && !dateOfBirth) {
		const currentYear = new Date().getFullYear();
		const birthYear = currentYear - userProfile.age;
		dateOfBirth = `${birthYear}-01-01`;
	}

	function handleSubmit() {
		loading = true;
		successMessage = '';
	}

	function handleResult() {
		loading = false;
		if (form?.success) {
			successMessage = 'Profile updated successfully!';
			isEditing = false;
			setTimeout(() => {
				successMessage = '';
			}, 3000);
		}
	}

	function toggleEdit() {
		if (isEditing) {
			// Reset to original values if cancelling
			name = userProfile?.name || '';
			phoneNumber = userProfile?.phone_number || '';
			sex = userProfile?.sex || '';
			age = userProfile?.age || null;
		}
		isEditing = !isEditing;
	}
</script>

<main class="flex flex-col items-center justify-center min-h-[60vh] px-4 pt-16">
	<div class="bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-pink-300 rounded-2xl shadow-lg px-8 py-12 text-center animate-in fade-in slide-in-from-left-12 duration-700 w-full max-w-2xl">
		<h1 class="text-4xl md:text-6xl font-black mb-8 text-pink-700 font-heading animate-in fade-in slide-in-from-left-12 duration-700">
			Welcome{name ? `, ${name}` : ''}!
		</h1>
		
		{#if form?.error}
			<div class="mb-4 p-3 rounded-md bg-red-50 text-red-700">
				{form.error}
			</div>
		{/if}

		{#if successMessage}
			<div class="mb-4 p-3 rounded-md bg-green-50 text-green-700">
				{successMessage}
			</div>
		{/if}
		
		<div class="text-left space-y-4 mb-6">
			<h2 class="text-2xl font-bold text-pink-700 mb-4 text-center">Profile Information</h2>
			
			{#if isEditing}
				<form 
					method="POST" 
					action="?/updateProfile"
					use:enhance={() => {
						handleSubmit();
						return async ({ result, update }) => {
							await update();
							handleResult();
						};
					}}
					class="space-y-4"
				>
					<div>
						<label for="name" class="block mb-1 font-semibold text-pink-700">Name</label>
						<input 
							id="name" 
							name="name"
							type="text" 
							bind:value={name} 
							required
							class="w-full p-2 border border-pink-300 rounded text-black focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
							placeholder="Enter your name"
						/>
					</div>
					
					<div>
						<label for="phone_number" class="block mb-1 font-semibold text-pink-700">Phone Number</label>
						<input 
							id="phone_number" 
							name="phone_number"
							type="tel" 
							bind:value={phoneNumber} 
							class="w-full p-2 border border-pink-300 rounded text-black focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
							placeholder="Enter your phone number"
						/>
					</div>
					
					<div>
						<label for="sex" class="block mb-1 font-semibold text-pink-700">Sex</label>
						<select 
							id="sex" 
							name="sex"
							bind:value={sex} 
							class="w-full p-2 border border-pink-300 rounded text-black focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
						>
							<option value="">Select...</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
							<option value="Other">Other</option>
						</select>
					</div>
					
					<div>
						<label for="date_of_birth" class="block mb-1 font-semibold text-pink-700">Date of Birth</label>
						<input 
							id="date_of_birth" 
							name="date_of_birth"
							type="date" 
							bind:value={dateOfBirth} 
							class="w-full p-2 border border-pink-300 rounded text-black focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
						/>
					</div>

					<!-- Keep age as backup for direct input -->
					<div>
						<label for="age" class="block mb-1 font-semibold text-pink-700">Age (if date of birth not provided)</label>
						<input 
							id="age" 
							name="age"
							type="number" 
							min="0" 
							max="120" 
							bind:value={age} 
							class="w-full p-2 border border-pink-300 rounded text-black focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
							placeholder="Enter your age"
						/>
					</div>
					
					<div class="flex space-x-3 pt-4">
						<button 
							type="submit" 
							disabled={loading}
							class="bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-2 px-4 rounded border border-pink-300 transition-all duration-300 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? 'Saving...' : 'Save Changes'}
						</button>
						
						<button 
							type="button" 
							on:click={toggleEdit}
							class="bg-gray-400 text-white font-bold py-2 px-4 rounded border border-gray-300 transition-all duration-300 hover:bg-gray-500"
						>
							Cancel
						</button>
					</div>
				</form>
			{:else}
				<div class="space-y-3">
					<div class="flex justify-between items-center">
						<span class="font-semibold text-pink-700">Email:</span>
						<span class="text-gray-700">{email || 'Not set'}</span>
					</div>
					
					<div class="flex justify-between items-center">
						<span class="font-semibold text-pink-700">Phone Number:</span>
						<span class="text-gray-700">{phoneNumber || 'Not set'}</span>
					</div>
					
					<div class="flex justify-between items-center">
						<span class="font-semibold text-pink-700">Sex:</span>
						<span class="text-gray-700">{sex || 'Not set'}</span>
					</div>
					
					<div class="flex justify-between items-center">
						<span class="font-semibold text-pink-700">Age:</span>
						<span class="text-gray-700">{age || 'Not set'}</span>
					</div>
				</div>
				
				<div class="pt-4 text-center">
					<button 
						on:click={toggleEdit}
						class="bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-2 px-6 rounded border border-pink-300 transition-all duration-300 hover:from-pink-500 hover:to-purple-500"
					>
						Edit Profile
					</button>
				</div>
			{/if}
		</div>
		
		<p class="text-lg text-pink-800">We're glad to see you here.</p>
	</div>
</main>
