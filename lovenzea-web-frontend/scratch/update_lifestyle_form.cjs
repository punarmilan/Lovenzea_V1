const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'components', 'profile', 'LifestyleForm.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add useEffect to imports if not there
if (!content.includes('useEffect')) {
  content = content.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";');
  if (!content.includes('useEffect')) {
    // If useState was not there (though it probably is), let's just add it at the top
    content = content.replace('import { useForm } from "react-hook-form";', 'import { useForm } from "react-hook-form";\nimport { useEffect } from "react";');
  }
}

// 2. Add watch and setValue to useForm destructuring
content = content.replace(
  /const {\s*register,\s*handleSubmit,\s*formState: { errors },\s*} = useForm\(\);/,
  `const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();`
);

// 3. Add maxDate18YearsAgo and useEffect logic just before onSubmit
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

// 4. Update Age input to be readOnly and DOB input to have max attribute
// Find age input
content = content.replace(
  /placeholder="Enter age"\s*\{\.\.\.register\("age"\)\}/,
  `placeholder="Auto-calculated"\n                readOnly\n                {...register("age")}`
);

// Find dob input
content = content.replace(
  /type="date"\s*\{\.\.\.register\("dob"\)\}/,
  `type="date"\n                max={maxDate18YearsAgo}\n                {...register("dob")}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated LifestyleForm.jsx with 18+ validation and auto-age.');
