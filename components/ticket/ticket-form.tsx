'use client';

import React, { useEffect } from 'react';
import {
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input
} from '../ui';
import * as z from 'zod';
import { PHONE_REGEX } from '@/constants';
import { UseFormReturn, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LuTicket } from 'react-icons/lu';

const ticketFormSchema = z.object({
  fullname: z.string({ required_error: 'Vui lòng nhập tên sự kiện' }),
  email: z
    .string()
    .min(1, { message: 'Email không được để trống' })
    .max(100, { message: 'Email không được vượt quá 100 kí tự' })
    .email('Email không hợp lệ'),
  phone: z
    .string()
    .min(1, 'Số điện thoại không được để trống')
    .regex(PHONE_REGEX, 'Số điện thoại không hợp lệ')
    .max(100, { message: 'Số điện thoại không được vượt quá 100 kí tự' })
});

interface TicketFormProps {
  isEditted?: boolean;
  contactForm?: UseFormReturn<
    {
      fullname: string;
      email: string;
      phone: string;
    },
    any,
    undefined
  >;
  ticketsForm: UseFormReturn<
    {
      tickets: z.infer<typeof ticketFormSchema>[];
    },
    any,
    undefined
  >;
  index: number;
}

export const TicketForm: React.FunctionComponent<TicketFormProps> = ({
  isEditted,
  contactForm,
  ticketsForm,
  index
}) => {
  const ticketForm = useForm<z.infer<typeof ticketFormSchema>>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: ticketsForm.watch().tickets[index],
    mode: 'onChange'
  });

  useEffect(() => {
    if (index === 0 && contactForm) {
      ticketForm.setValue('email', contactForm.watch().email);
      ticketForm.setValue('fullname', contactForm.watch().fullname);
      ticketForm.setValue('phone', contactForm.watch().phone);
    }
  }, []);

  useEffect(() => {
    ticketsForm.setValue(
      `tickets.${index}.fullname`,
      ticketForm.watch().fullname
    );
    ticketsForm.setValue(`tickets.${index}.email`, ticketForm.watch().email);
    ticketsForm.setValue(`tickets.${index}.phone`, ticketForm.watch().phone);
  }, [ticketForm.watch()]);

  return (
    <div className="px-6 py-[30px] rounded-m border border-solid border-neutral-200">
      <div className="flex items-center justify-between mb-[22px]">
        {!isEditted && (
          <div className="flex items-center gap-3">
            <LuTicket className="text-2xl text-primary-500" />
            <span className="font-bold text-neutral-650">Vé {index + 1}</span>
          </div>
        )}
        {index === 0 && contactForm && (
          <div className="flex items-center gap-2">
            <Checkbox
              id="repeat"
              defaultChecked={true}
              onCheckedChange={checked => {
                if (checked) {
                  ticketForm.setValue('email', contactForm.watch().email);
                  ticketForm.setValue('fullname', contactForm.watch().fullname);
                  ticketForm.setValue('phone', contactForm.watch().phone);
                } else {
                  ticketForm.reset();
                }
              }}
            />
            <FormLabel htmlFor="repeat">Lấy thông tin liên lạc</FormLabel>
          </div>
        )}
      </div>
      <Form {...ticketForm}>
        <form className="grid grid-cols-2 grid-rows-2 gap-6">
          <div className="col-span-2">
            <FormField
              control={ticketForm.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Nhập họ tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={ticketForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example.email@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={ticketForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Nhập số điện thoại"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
