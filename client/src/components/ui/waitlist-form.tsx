import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { insertWaitlistEntrySchema } from "@shared/schema";
import { CheckCircle } from "lucide-react";

const formSchema = insertWaitlistEntrySchema.extend({
  newsletter: z.boolean().default(false),
});

export default function WaitlistForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      experience: "",
      newsletter: false
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await apiRequest('POST', '/api/waitlist', values);
      setIsSubmitted(true);
      toast({
        title: "Success!",
        description: "You've been added to our waitlist.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="text-primary text-5xl mb-4 flex justify-center">
          <CheckCircle className="h-16 w-16" />
        </div>
        <h3 className="font-display font-bold text-2xl mb-2">You're on the list!</h3>
        <p className="text-slate-300">Thanks for joining our waitlist. We'll notify you when we launch.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-slate-300">First Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Your first name" 
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700/50 focus:border-primary text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-slate-300">Last Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Your last name" 
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700/50 focus:border-primary text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-slate-300">Email Address</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="email"
                  placeholder="your.email@example.com" 
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700/50 focus:border-primary text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-slate-300">Experience Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger 
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700/50 focus:border-primary text-white"
                  >
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (&lt; 1 year)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                  <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                  <SelectItem value="expert">Expert (5+ years)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="newsletter"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-800/60 text-primary"
                />
              </FormControl>
              <FormLabel className="text-sm text-slate-300">
                I'd like to receive updates about new features, tips, and embedded systems content.
              </FormLabel>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-slate-900 font-bold rounded-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
        >
          {isSubmitting ? "Processing..." : "Join the Waitlist"}
        </Button>
      </form>
    </Form>
  );
}
