import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full border-t px-8 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-sm bg-orange-500"></div>
            <span className="font-bold text-lg">Opion</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Ease of shopping is our main focus. With powerful search features
            and customizable filters, you can easily find the products you are
            looking for.
          </p>
          <div className="flex gap-3 mb-4">
            <Facebook className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-black" />
            <Instagram className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-black" />
            <Linkedin className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-black" />
          </div>
          <p className="text-sm font-medium mb-2">Subscribe to Newsletter</p>
          <div className="flex">
            <Input
              placeholder="Enter Your Email Here"
              className="rounded-r-none"
            />
            <Button className="rounded-l-none">→</Button>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Get Started</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Service</li>
            <li>Contact Us</li>
            <li>Affiliate Program</li>
            <li>About Us</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Get Started</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Dashboard</li>
            <li>Platform</li>
            <li>Workout Library</li>
            <li>App Design</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Get Started</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>About Us</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
        <p>2024 MaxFit</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <span className="cursor-pointer hover:text-black">Twitter</span>
          <span className="cursor-pointer hover:text-black">Instagram</span>
          <span className="cursor-pointer hover:text-black">Facebook</span>
        </div>
      </div>
    </footer>
  );
};
