const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'components', 'profile', 'LifestyleForm.jsx');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('useEffect')) {
  content = content.replace('import { useForm } from "react-hook-form";', 'import { useForm } from "react-hook-form";\nimport { useEffect } from "react";');
}

// Ensure watch and setValue are in useForm destructuring
// In LifestyleForm, it usually looks like:
// const {
//   register,
//   handleSubmit,
// } = useForm();
// Let's replace exactly that!
const regexUseForm = /const \{\s*register,\s*handleSubmit,\s*\}\s*=\s*useForm\(\);/;
content = content.replace(
  regexUseForm,
  `const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm();`
);

// If it doesn't have a trailing comma:
const regexUseFormNoComma = /const \{\s*register,\s*handleSubmit\s*\}\s*=\s*useForm\(\);/;
content = content.replace(
  regexUseFormNoComma,
  `const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm();`
);

const logicToInsert = `
  const maxDate18YearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0];
  const dob = watch("dob");

  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setValue("age", age);
    }
  }, [dob, setValue]);
`;

content = content.replace('const onSubmit = async (data) => {', logicToInsert + '\n  const onSubmit = async (data) => {');

content = content.replace(
  /placeholder="Enter age"\s*\{\.\.\.register\("age"\)\}/,
  `placeholder="Auto-calculated"\n                readOnly\n                {...register("age")}`
);

content = content.replace(
  /type="date"\s*\{\.\.\.register\("dob"\)\}/,
  `type="date"\n                max={maxDate18YearsAgo}\n                {...register("dob")}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed LifestyleForm.jsx script and updated the file.');
