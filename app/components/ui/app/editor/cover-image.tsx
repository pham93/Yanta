import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { LucideImage, LucideUpload } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { Img } from "~/components/ui/image";

const CoverImage = () => {
  const [coverImage, setCoverImage] = useState<string | null>(
    "https://cdn.leonardo.ai/users/0ec727fb-b208-4674-8b2a-2a71a7c8ad3f/generations/a5f3ffee-6c93-4a2c-84ce-4e078a42fd7f/variations/UniversalUpscaler_a5f3ffee-6c93-4a2c-84ce-4e078a42fd7f.jpg"
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCoverImage = () => {
    setCoverImage(null);
  };

  return (
    <div className="relative mb-10">
      {coverImage ? (
        <Img
          src={coverImage}
          alt="Cover"
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-[4rem]" />
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant={"ghost"}
            className="hover:bg-transparent absolute bottom-4 right-[5%]"
          >
            Select Cover <LucideImage />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-[36rem] z-[9999] flex justify-center flex-col p-2">
          <Tabs defaultValue="gallery">
            <div className="header border-b-slate-200 justify-between flex">
              <TabsList className="grid w-[50%] grid-cols-4 bg-transparent p-0 text-left">
                <TabsTrigger value="gallery" className="text-xs justify-start">
                  Gallery
                </TabsTrigger>
                <TabsTrigger value="upload" className="text-xs justify-start">
                  Upload
                </TabsTrigger>
                <TabsTrigger value="link" className="text-xs justify-start">
                  Link
                </TabsTrigger>
                <TabsTrigger value="AI" className="text-xs justify-start">
                  AI
                </TabsTrigger>
              </TabsList>
              <Button
                variant={"ghost"}
                size={"sm"}
                onClick={handleRemoveCoverImage}
              >
                Remove
              </Button>
            </div>
            <Separator />
            <TabsContent value="gallery">
              <div className="thumbnails grid gap-2 grid-cols-4 mt-6">
                {Array(5)
                  .fill(1)
                  .map((_, idx) => (
                    <Button
                      key={idx}
                      asChild
                      variant={"ghost"}
                      onClick={() =>
                        setCoverImage(
                          "https://cdn.leonardo.ai/users/0ec727fb-b208-4674-8b2a-2a71a7c8ad3f/generations/a5f3ffee-6c93-4a2c-84ce-4e078a42fd7f/variations/UniversalUpscaler_a5f3ffee-6c93-4a2c-84ce-4e078a42fd7f.jpg"
                        )
                      }
                      className={cn(
                        "w-36 h-20 rounded-sm bg-slate-400 object-cover cursor-pointer p-0",
                        "hover:ring-2 hover:ring-accent-foreground"
                      )}
                    >
                      <Img
                        src="https://cdn.leonardo.ai/users/0ec727fb-b208-4674-8b2a-2a71a7c8ad3f/generations/a5f3ffee-6c93-4a2c-84ce-4e078a42fd7f/variations/UniversalUpscaler_a5f3ffee-6c93-4a2c-84ce-4e078a42fd7f.jpg"
                        alt="example"
                        key={idx}
                      />
                    </Button>
                  ))}
              </div>

              <Button variant={"outline"} className="mt-2 float-right">
                Select
              </Button>
            </TabsContent>
            <TabsContent value="upload">
              <div className="h-[10rem] flex justify-center items-center flex-col">
                <label
                  htmlFor="upload-img"
                  className="rounded-[50%] h-16 w-16 cursor-pointer flex items-center justify-center bg-secondary"
                >
                  <LucideUpload />
                  <input
                    id="upload-img"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                <p className="text-md">Upload file</p>
                <p className="text-xs dark:text-gray-400">
                  Pick a file up to 2MB
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CoverImage;
