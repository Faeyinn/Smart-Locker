import Link from "next/link";
import { Box } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-12 bg-muted/20">
      <div className="container px-4 md:px-6 mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Box className="w-6 h-6 text-primary" />
            <span>SmartLocker</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Revolutionizing personal storage with smart technology and secure
            infrastructure.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/features" className="hover:text-foreground transition-colors">
                Features
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/about" className="hover:text-foreground transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/cookie-policy" className="hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground container mx-auto">
        &copy; {new Date().getFullYear()} SmartLocker IoT Project. All rights
        reserved.
      </div>
    </footer>
  );
}
