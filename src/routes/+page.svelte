<script lang="ts">
    import { Form, FormRow, TextInput, EmailInput, CountryInput, 
             DropdownInput, DropdownSelect, NumberInput, CheckboxGroup, 
             MultilineTextInput, ConsentCheckbox } from '$lib/index.js';
    
    // Sample form data for testing
    let formData = {
      first_name: '',
      last_name: '',
      email: '',
      country: '',
      profession: '',
      years_experience: 0,
      organization: '',
      linkedin: '',
      tools_used: [],
      use_case: '',
      privacy_consent: false
    };
  
    // Sample professions for dropdown
    const professions = [
      'teacher',
      'professor',
      'researcher',
      'other'
    ];
  
    const pros = [
      {
        value: 'teacher',
        label: 'Teacher'
      },
      {
        value: 'professor',
        label: 'Professor'
      },
      {
        value: 'researcher',
        label: 'Researcher'
      },
      {
        value: 'other',
        label: 'Other'
      }
    ]

    // Sample tools for checkbox group
    const tools = [
      'Tool 1',
      'Tool 2',
      'Tool 3',
      'Tool 4'
    ];
  
    function handleSubmit(event: SubmitEvent) {
      event.preventDefault();
      console.log('Form submitted:', formData);
    }
  </script>
  
  <div class="container mx-auto p-8">
    <div class="mx-auto">      
      <Form 
        title="Registration Form"
        description="Test out the form components"
        style="default"
        on_submit={handleSubmit}
      >
        <FormRow>
          <TextInput
            name="firstName"
            label="First Name"
            bind:value={formData.first_name}
            required
          />
  
          <TextInput
            name="lastName"
            label="Last Name"
            bind:value={formData.last_name}
            required
          />
        </FormRow>
  
        <FormRow>
          <EmailInput
            name="email"
            label="Email"
            bind:value={formData.email}
            required
          />
    
          <CountryInput
            name="country"
            label="Country"
            bind:value={formData.country}
            required
          />
        </FormRow>

        <FormRow>
          <DropdownInput
            name="profession"
            label="Profession"
            bind:value={formData.profession}
            options={pros}
            required
          />
  
          <NumberInput
            name="yearsExperience"
            label="Years of Experience"
            bind:value={formData.years_experience}
            min={0}
            max={100}
            required
            tooltip="Number of years of professional experience"
          />
        </FormRow>

        <CheckboxGroup
          name="toolsUsed"
          label="Tools Used"
          options={tools}
          bind:group={formData.tools_used}
          columns={4}
          required
        />
  
        <MultilineTextInput
          name="useCase"
          label="Use Case"
          bind:value={formData.use_case}
          required
        />
  
        <ConsentCheckbox
          name="privacyConsent"
          text="I agree to the privacy policy"
          bind:checked={formData.privacy_consent}
          required
        />
      </Form>
    </div>
  </div>
