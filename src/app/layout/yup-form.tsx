'use client';
import { useForm } from 'react-hook-form';
//use yupResolver
import { yupResolver } from '@hookform/resolvers/yup';
import * as y from 'yup';
const sexOptions = ['male', 'female', 'other', null] as const;

/** schema */
const userSchema = y.object({
  name: y.string().trim().required('必填欄位'),
  age: y
    .number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .nullable()
    .required('必填欄位')
    .positive()
    .integer(),
  income: y
    .number()
    .transform((value) => (isNaN(value) ? undefined : value)) //for number NaN error
    .when('age', ([age], schema) => {
      //when is kind of like superRefine in Zod
      return age > 18 ? schema.required('必填欄位') : schema.optional();
    }),
  email: y
    .string()
    .trim()
    .required('必填欄位')
    .min(3, 'must be at least 3 characters long')
    .email('must be a valid email'),
  sex: y
    .string()
    .trim()
    .required('必填欄位')
    .oneOf(['male', 'female', 'other', ''] as const), //array options
  website: y.string().trim().url().optional(),
  createdOn: y
    .date()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .required('必填欄位'),
  key: y
    .string()
    .required('必填欄位')
    .test({
      //custom Error msg and validations
      test(value, ctx) {
        if (value !== 'key') {
          return ctx.createError({ message: 'key is not correct' });
        }
        return true;
      },
    }),
});

/**infer type */
type User = y.InferType<typeof userSchema>;

export function YupForm() {
  const resolver = yupResolver(userSchema);
  const { handleSubmit, register, formState } = useForm({ resolver });

  function onSubmitHanlder(data: User) {
    //RHF would automatically call cast and validate
    const parsed = userSchema.cast(data);
    console.log(data);
  }

  return (
    <form className="border flex items-center justify-center w-1/2 p-2" onSubmit={handleSubmit(onSubmitHanlder)}>
      <div className="flex flex-col gap-2 w-full">
        <label>name</label>
        <input className="border" {...register('name')} />
        <p className="text-red-500">{formState.errors.name?.message}</p>

        <label>age</label>
        <input className="border" {...register('age')} />
        <p className="text-red-500">{formState.errors.age?.message}</p>

        <label>income</label>
        <input className="border" {...register('income')} />
        <p className="text-red-500">{formState.errors.income?.message}</p>

        <label>email</label>
        <input className="border" {...register('email')} />
        <p className="text-red-500">{formState.errors.email?.message}</p>

        <label>sex</label>
        <input className="border" {...register('sex')} />
        <p className="text-red-500">{formState.errors.sex?.message}</p>

        <label>website</label>
        <input className="border" {...register('website')} />
        <p className="text-red-500">{formState.errors.website?.message}</p>

        <label>createdOn</label>
        <input className="border" type="date" {...register('createdOn')} />
        <p className="text-red-500">{formState.errors.createdOn?.message}</p>

        <label>key</label>
        <input className="border" {...register('key')} />
        <p className="text-red-500">{formState.errors.key?.message}</p>
        <input type="submit" />
      </div>
    </form>
  );
}
