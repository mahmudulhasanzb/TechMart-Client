'use client';

import { authClient } from '@/lib/auth-client';
import { uploadImage } from '@/lib/uploadImage';
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from '@heroui/react';

export default function SignUpPage() {
  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formEntries = Object.fromEntries(formData.entries())
    const image = await uploadImage(formEntries.image)

    
    console.log('imgbb respose',image.data.url)
    console.log(formEntries)

    // authontication
    const { data, error } = await authClient.signUp.email({
        ...formEntries,
        image: image.data.url,
    });
    console.log({ data, error });
  };

  return (
    <>
      <Form className="flex w-96 flex-col gap-4" onSubmit={onSubmit}>
        <TextField isRequired >
          <Label>Image</Label>
          <input type="file" name="image" />
          <FieldError/>
        </TextField>

        <TextField isRequired name="name" type="text">
          <Label>Name</Label>
          <Input placeholder="john doe" />
          <FieldError />
        </TextField>

        <TextField
          isRequired
          name="email"
          type="email"
          validate={value => {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
              return 'Please enter a valid email address';
            }

            return null;
          }}
        >
          <Label>Email</Label>
          <Input placeholder="john@example.com" />
          <FieldError />
        </TextField>

        <TextField
          isRequired
          minLength={8}
          name="password"
          type="password"
          validate={value => {
            if (value.length < 8) {
              return 'Password must be at least 8 characters';
            }
            if (!/[A-Z]/.test(value)) {
              return 'Password must contain at least one uppercase letter';
            }
            if (!/[0-9]/.test(value)) {
              return 'Password must contain at least one number';
            }

            return null;
          }}
        >
          <Label>Password</Label>
          <Input placeholder="Enter your password" />
          <Description>
            Must be at least 8 characters with 1 uppercase and 1 number
          </Description>
          <FieldError />
        </TextField>

        <div className="flex gap-2">
          <Button type="submit">Submit</Button>
          <Button type="reset" variant="secondary">
            Reset
          </Button>
        </div>
        <Button variant="secondary">login with Google</Button>
      </Form>
    </>
  );
}
