import DynamicForm from "@/FormBuilder";
import { useTranslation } from "react-i18next";

function Home() {
  const { t, i18n } = useTranslation();

  const lang = document.documentElement.dir === "rtl" ? "ar" : "en";

  // Group the form fields into sections for Accordion
  const formSections = [
    {
      sectionTitle: "Personal Information",
      sectionDescription: "Enter your personal information",
      sectionIcon: "👤",
      notCollapsible: true,
      fields: [
        {
          name: "name",
          type: "text",
          component: "Input",
          label: "Name",
          placeholder: "Enter your full name",
          validation: {
            required: "Name is required",
            minLength: {
              value: 4,
              message: "Name must be at least 4 characters",
            },
            maxLength: {
              value: 12,
              message: "Name cannot be more than 12 characters",
            },
          },
        },
        {
          name: "national ID",
          type: "text",
          component: "Input",
          label: "National ID",
          placeholder: "Enter your National ID",
          allowedCharacters: "0-9",
          validation: {
            required: "National ID is required",
            minLength: {
              value: 4,
              message: "National ID must be at least 4 characters",
            },
            maxLength: {
              value: 12,
              message: "National ID cannot be more than 12 characters",
            },
          },
        },
        {
          name: "birthdate",
          type: "date",
          component: "DatePicker",
          label: "Birthdate",
          placholder: "Enter your birthdate",
          validation: {
            required: "Birthdate is required",
          },
        },
      ],
    },
    {
      sectionTitle: t("Employee Information"),
      sectionDescription: "Enter your employee information",
      sectionIcon: "👨‍💼",

      fields: [
        {
          name: "phone",
          type: "text",
          component: "Input",
          label: "Phone Number",
          placeholder: "Enter your phone number",
          allowedCharacters: "0-9",
          validation: {
            required: "Phone Number is required",
            pattern: {
              value: /^\d{10}$/,
              message: "Phone number must be 10 digits",
            },
            maxLength: {
              value: 10,
              message: "Phone number must be 10 digits",
            },
          },
        },
        {
          name: "email",
          type: "text",
          component: "Input",
          label: "Email",
          placeholder: "Enter your email",
          validation: {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Email is invalid",
            },
          },
        },
      ],
    },

    {
      sectionTitle: "Skills and Preferences",
      sectionDescription: "Select the framework and skills you have",
      sectionIcon: "🛠️",
      fields: [
        {
          name: "framework",
          type: "combobox",
          component: "Combobox",
          label: "Framework",
          placeholder: "Select a framework",
          items: [
            { value: "next.js", label: "Next.js" },
            { value: "sveltekit", label: "SvelteKit" },
            { value: "nuxt.js", label: "Nuxt.js" },
            { value: "remix", label: "Remix" },
            { value: "astro", label: "Astro" },
          ],
          validation: {
            required: "Please select a framework",
          },
        },
        {
          name: "skills",
          type: "multi-select",
          component: "MultiSelect",
          label: "Skills",
          placeholder: "Select your skills",
          items: [
            { value: "react", label: "React" },
            { value: "angular", label: "Angular" },
            { value: "vue", label: "Vue" },
            { value: "svelte", label: "Svelte" },
            { value: "ember", label: "Ember" },
          ],
          validation: {
            required: "Select at least one skill",
            min: 1,
            max: 3,
          },
        },
      ],
    },
  ];
  const formSectionsAr = [
    {
      sectionTitle: "المعلومات الشخصية",
      sectionIcon: "👤",
      notCollapsible: true,
      fields: [
        {
          name: "name",
          type: "text",
          component: "Input",
          label: "الاسم",
          placeholder: "أدخل الاسم الكامل",
          validation: {
            required: "الاسم مطلوب",
            minLength: {
              value: 4,
              message: "يجب أن يكون الاسم على الأقل 4 أحرف",
            },
            maxLength: {
              value: 12,
              message: "لا يمكن أن يزيد الاسم عن 12 حرفًا",
            },
          },
        },
        {
          name: "national ID",
          type: "text",
          component: "Input",
          label: "الرقم القومي",
          placeholder: "أدخل الرقم القومي",
          allowedCharacters: "0-9",
          validation: {
            required: "الرقم القومي مطلوب",
            minLength: {
              value: 4,
              message: "يجب أن يكون الرقم القومي على الأقل 4 أحرف",
            },
            maxLength: {
              value: 12,
              message: "لا يمكن أن يزيد الرقم القومي عن 12 حرفًا",
            },
          },
        },
        {
          name: "birthdate",
          type: "date",
          component: "DatePicker",
          label: "تاريخ الميلاد",
          placholder: "أدخل تاريخ الميلاد",
          validation: {
            required: "تاريخ الميلاد مطلوب",
          },
        },
      ],
    },

    {
      sectionTitle: "معلومات الموظف",
      fields: [
        {
          name: "phone",
          type: "text",
          component: "Input",
          label: "رقم الهاتف",
          placeholder: "أدخل رقم هاتفك",
          allowedCharacters: "0-9",
          validation: {
            required: "رقم الهاتف مطلوب",
            pattern: {
              value: /^\d{10}$/,
              message: "يجب أن يتكون رقم الهاتف من 10 أرقام",
            },
            maxLength: {
              value: 10,
              message: "يجب أن يتكون رقم الهاتف من 10 أرقام",
            },
          },
        },
        {
          name: "email",
          type: "text",
          component: "Input",
          label: "البريد الإلكتروني",
          placeholder: "أدخل البريد الإلكتروني",
          validation: {
            required: "البريد الإلكتروني مطلوب",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "البريد الإلكتروني غير صحيح",
            },
          },
        },
      ],
    },
    {
      sectionTitle: "المهارات والتفضيلات",
      sectionDescription: "اختر الإطار والمهارات التي تمتلكها",
      sectionIcon: "🛠️",
      fields: [
        {
          name: "framework",
          type: "combobox",
          component: "Combobox",
          placeholder: "اختر الإطار",
          label: "الإطار",
          items: [
            { value: "next.js", label: "Next.js" },
            { value: "sveltekit", label: "SvelteKit" },
            { value: "nuxt.js", label: "Nuxt.js" },
            { value: "remix", label: "Remix" },
            { value: "astro", label: "Astro" },
          ],
          validation: {
            required: "الرجاء اختيار إطار عمل",
          },
        },
        {
          name: "skills",
          type: "multi-select",
          component: "MultiSelect",
          placeholder: "حدد مهاراتك",
          label: "المهارات",
          items: [
            { value: "react", label: "React" },
            { value: "angular", label: "Angular" },
            { value: "vue", label: "Vue" },
            { value: "svelte", label: "Svelte" },
            { value: "ember", label: "Ember" },
          ],
          validation: {
            required: "اختر مهارة واحدة على الأقل",
            min: 1,
            max: 3,
          },
        },
      ],
    },
  ];
  return (
    <div>
      <DynamicForm
        data={lang === "ar" ? formSectionsAr : formSections}
        languge={lang}
      />
    </div>
  );
}

export default Home;
