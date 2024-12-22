import { useChildren } from "@/hooks/use-achievements";
import Header from "@/components/Header";
import ChildProfileCard from "@/components/ChildProfileCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertChildSchema } from "@db/schema";
import { useAddChild } from "@/hooks/use-achievements";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Dashboard() {
  const { data: children, isLoading } = useChildren();
  const [isAddingChild, setIsAddingChild] = useState(false);
  const addChild = useAddChild();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertChildSchema),
    defaultValues: {
      name: "",
      dateOfBirth: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (values: any) => {
    try {
      if (!values.name || !values.dateOfBirth) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const formattedValues = {
        ...values,
        dateOfBirth: new Date(values.dateOfBirth).toISOString(),
      };
      
      await addChild.mutateAsync(formattedValues);
      setIsAddingChild(false);
      form.reset();
      toast({
        title: "Success",
        description: "Child profile added successfully",
      });
    } catch (error: any) {
      console.error('Error adding child:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add child profile",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Children Profiles</h2>
          <Dialog open={isAddingChild} onOpenChange={setIsAddingChild}>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="mr-2 h-4 w-4" />
                Add Child
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Child Profile</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter child's name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={form.formState.isSubmitting || !form.formState.isValid}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding Child...
                      </>
                    ) : (
                      "Add Child"
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {children && children.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <ChildProfileCard key={child.id} child={child} />
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Welcome to HypeDoc!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get started by adding your first child profile using the button above.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
