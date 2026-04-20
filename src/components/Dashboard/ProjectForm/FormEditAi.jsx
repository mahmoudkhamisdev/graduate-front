import { ArrowUp, Send } from "lucide-react";
import React from "react";
import { Button } from "src/components/ui/button";

export default function FormEditAi({ formData }) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">How i can help you?</h2>
          <p className="text-sm text-gray-500">What do you want to modify?</p>
        </div>

        <div className="border bg-sidebar p-4 rounded-3xl flex items-center justify-between gap-4">
          <input
            placeholder="What is in your mine!!"
            className="flex-1 bg-transparent outline-none"
          />
          <Button size="icon" className="rounded-full">
            <ArrowUp />
          </Button>
        </div>
      </div>
    </div>
  );
}
