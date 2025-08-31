import { Phone, Mail, MapPin } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(2, "Please enter at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(7, "Phone number is too short")
    .max(15, "Phone number is too long"),
  message: z.string().min(10, "Please enter at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form data submitted:", data);
  };

  return (
    <section className="bg-white/90 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or special requests? We're here to help with anything
            coffee-related.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Phone className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Call Us</h2>
                  <p className="text-gray-600">+254 732 100 200</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Mon-Fri, 8am-5pm EAT
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Mail className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Email Us
                  </h3>
                  <p className="text-gray-600">info@roasterbros.com</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Typically reply within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <MapPin className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Visit Us
                  </h2>
                  <p className="text-gray-600">P.O Box 32657</p>
                  <p className="text-gray-600">Nairobi, Kenya</p>
                </div>
              </div>
            </div>

            <div className="h-[400px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8084773955137!2d36.82154831532839!3d-1.288885835980772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d664fecf0f%3A0x7e5c1cdef5e0589e!2sNairobi%20CBD!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                className="border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your name"
                          {...field}
                          className="focus:ring-amber-500 focus:border-amber-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your@email.com"
                          type="email"
                          {...field}
                          className="focus:ring-amber-500 focus:border-amber-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+254 700 000000"
                          type="tel"
                          {...field}
                          className="focus:ring-amber-500 focus:border-amber-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Your Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="How can we help you?"
                          rows={5}
                          {...field}
                          className="focus:ring-amber-500 focus:border-amber-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg font-medium transition-colors duration-300"
                >
                  Send Message
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
