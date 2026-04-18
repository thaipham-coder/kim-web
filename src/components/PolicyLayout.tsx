import Footer from "@/components/Footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import React from "react";

export interface BreadcrumbStep {
  label: string;
  href?: string;
}

export default function PolicyLayout({
  children,
  breadcrumb = [],
}: {
  children: React.ReactNode;
  breadcrumb?: BreadcrumbStep[];
}) {
  return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <main className="flex-grow max-w-4xl mx-auto w-full px-4 lg:px-6 py-12 pt-8 md:pt-16">
          {breadcrumb.length > 0 && (
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumb.map((item, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        {item.href ? (
                          <BreadcrumbLink asChild>
                            <Link href={item.href}>{item.label}</Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{item.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumb.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          )}

          <div className="bg-white p-6 md:p-12 lg:p-16 rounded-[2rem] border border-neutral-100 shadow-sm">
            {children}
          </div>
        </main>

        <Footer />
      </div>

  );
}
