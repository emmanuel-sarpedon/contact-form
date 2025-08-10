"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addProspectToNotion } from "@/lib/add-prospect-to-notion";
import classNames from "classnames";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  fullName: z.string().min(2),
  society: z.string().min(2).optional(),
  email: z.email(),
  phoneNumber: z.string().min(10).optional(),
  message: z.string().min(10),
  website: z.string().optional(),
  consent: z.boolean().refine((value) => value === true, {
    error: "Vous devez accepter la collecte de vos données personnelles",
  }),
});

export default function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      message: "",
      consent: false,
    },
  });

  const { formState } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.promise(
      addProspectToNotion({ ...values }).then(() => {}),
      {
        loading: "Envoi de la demande...",
        success: "Demande envoyée avec succès. Je vous recontacte dans les 48h",
        error: "Une erreur est survenue lors de l'envoi de la demande",
      },
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 lg:mx-auto lg:grid lg:max-w-5xl lg:grid-cols-3"
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className={"lg:col-span-1"}>
              <FormLabel>Nom Prénom</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={
                    formState.isSubmitting ||
                    formState.isSubmitSuccessful ||
                    formState.disabled
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="society"
          render={({ field }) => (
            <FormItem className={"lg:col-span-1"}>
              <FormLabel>Entreprise</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={
                    formState.isSubmitting ||
                    formState.isSubmitSuccessful ||
                    formState.disabled
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={
                    formState.isSubmitting ||
                    formState.isSubmitSuccessful ||
                    formState.disabled
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>N° de téléphone</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={
                    formState.isSubmitting ||
                    formState.isSubmitSuccessful ||
                    formState.disabled
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site internet</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={
                    formState.isSubmitting ||
                    formState.isSubmitSuccessful ||
                    formState.disabled
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className={"lg:col-span-3"}>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={
                    formState.isSubmitting ||
                    formState.isSubmitSuccessful ||
                    formState.disabled
                  }
                  rows={10}
                />
              </FormControl>
              <FormDescription>
                Veuillez décrire votre projet en quelques lignes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem
              className={"flex flex-row items-end gap-x-4 lg:col-span-3"}
            >
              <FormControl>
                <Checkbox
                  id={"consent"}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={
                    formState.isSubmitting ||
                    formState.isSubmitSuccessful ||
                    formState.disabled
                  }
                />
              </FormControl>
              <FormLabel htmlFor={"consent"}>
                J'accepte la collecte de mes données personnelles et d'être
                recontacté par email ou téléphone. Aucune information ne sera
                transmise à des tiers.
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type={"submit"}
          className={classNames("mx-auto lg:col-span-3", {
            "bg-orange-600": !formState.isSubmitSuccessful,
          })}
          variant={formState.isSubmitSuccessful ? "ghost" : undefined}
          disabled={
            formState.isSubmitting ||
            formState.isSubmitSuccessful ||
            formState.disabled
          }
        >
          Envoyer ma demande
        </Button>
      </form>
    </Form>
  );
}
