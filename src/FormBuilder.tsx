// @ts-nocheck
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MultiSelect } from "@/components/ui/multi-select"; // Corrected MultiSelect import
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils"; // utility for class names
import { Checkbox } from "@/components/ui/checkbox"; // Correct Checkbox import
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"; // For Combobox
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"; // Icons for Combobox

// Sample frameworks list for MultiSelect with icons
import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";

// Framework list example for the MultiSelect
const frameworksList = [
  { value: "react", label: "React", icon: Turtle },
  { value: "angular", label: "Angular", icon: Cat },
  { value: "vue", label: "Vue", icon: Dog },
  { value: "svelte", label: "Svelte", icon: Rabbit },
  { value: "ember", label: "Ember", icon: Fish },
];

// Combobox data
const comboboxFrameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

// Dynamically create Zod schema based on the JSON structure
const createSchema = (fields: any) => {
  const schemaObject: any = {};
  fields.forEach((field: any) => {
    let validation = z.string();
    if (field.validation?.required) {
      validation = validation.nonempty(field.validation.required);
    }
    if (field.validation?.minLength) {
      validation = validation.min(
        field.validation.minLength.value,
        field.validation.minLength.message
      );
    }
    if (field.validation?.maxLength) {
      validation = validation.max(
        field.validation.maxLength.value,
        field.validation.maxLength.message
      );
    }
    schemaObject[field.name] = validation;
  });
  return z.object(schemaObject);
};

// JSON data
const formJson = {
  fields: [
    {
      name: "acceptTerms",
      type: "checkbox",
      component: "Checkbox",
      label: "Accept Terms",
      validation: {
        required: "You must accept the terms",
      },
    },
    {
      name: "gender",
      type: "radio",
      component: "RadioGroup",
      label: "Gender",
      items: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ],
      validation: {
        required: "Please select a gender",
      },
    },
    {
      name: "skills",
      type: "multi-select",
      component: "MultiSelect",
      label: "Skills",
      items: frameworksList, // List of frameworks
      validation: {
        required: "Select at least one skill",
        min: 1,
        max: 3,
      },
    },
    {
      name: "birthdate",
      type: "date",
      component: "DatePicker",
      label: "Birthdate",
      validation: {
        required: "Please select your birthdate",
      },
    },
    {
      name: "framework",
      type: "combobox",
      component: "Combobox",
      label: "Framework",
      items: comboboxFrameworks, // Combobox frameworks
      validation: {
        required: "Please select a framework",
      },
    },
    {
      name: "username",
      type: "text",
      component: "Input",
      label: "Username",
      placeholder: "Enter your username",
      validation: {
        required: "Username is required",
        minLength: {
          value: 4,
          message: "Username must be at least 4 characters",
        },
        maxLength: {
          value: 12,
          message: "Username cannot be more than 12 characters",
        },
      },
    },
    {
      name: "bio",
      type: "textarea",
      component: "Textarea",
      label: "Bio",
      placeholder: "Tell us about yourself",
      validation: {
        required: "Bio is required",
        minLength: {
          value: 10,
          message: "Bio must be at least 10 characters",
        },
      },
    },
  ],
};

const DynamicForm: FC = () => {
  const schema = createSchema(formJson.fields);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState("");

  const onSubmit = (data: any) => {
    console.log(data);
  };

  // Function to dynamically render components based on JSON config
  const renderComponent = (field: any) => {
    switch (field.component) {
      case "Input":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            {...register(field.name)}
            className="border p-2 rounded-md"
          />
        );
      case "Textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            {...register(field.name)}
            className="border p-2 rounded-md"
          />
        );
      case "Checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={field.name} {...register(field.name)} />
            <label
              htmlFor={field.name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </label>
          </div>
        );
      case "RadioGroup":
        return (
          <RadioGroup {...register(field.name)} className="space-y-4">
            {field.items.map((item: any) => (
              <div key={item.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={item.value}
                  id={`${field.name}-${item.value}`}
                />
                <Label htmlFor={`${field.name}-${item.value}`}>
                  {item.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "MultiSelect":
        return (
          <MultiSelect
            options={field.items}
            onValueChange={setSelectedSkills}
            defaultValue={selectedSkills}
            placeholder="Select your skills"
            maxCount={field.validation.max}
          />
        );
      case "Combobox":
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {selectedFramework
                  ? field.items.find((f: any) => f.value === selectedFramework)
                      ?.label
                  : "Select framework..."}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search framework..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {field.items.map((framework: any) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          setSelectedFramework(
                            currentValue === selectedFramework
                              ? ""
                              : currentValue
                          );
                          setOpen(false);
                        }}
                      >
                        {framework.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedFramework === framework.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      case "DatePicker":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {formJson.fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          <label htmlFor={field.name} className="font-medium">
            {field.label}
          </label>
          {renderComponent(field)}
          {errors[field.name] && (
            <p className="text-red-500 text-sm">
              {(errors as any)[field.name]?.message}
            </p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
      >
        Submit
      </button>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Selected Skills:</h2>
        <ul className="list-disc list-inside">
          {selectedSkills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>
    </form>
  );
};

export default DynamicForm;
