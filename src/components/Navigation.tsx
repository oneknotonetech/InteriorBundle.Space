// components/Navigation.tsx
'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Monitor } from 'lucide-react';

const Navigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="shadow-lg">
        <CardContent className="p-2">
          <div className="flex items-center space-x-2">
            <Link href="/gen-ai-studio">
              <Button
                variant={pathname === '/gen-ai-studio' ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>User Studio</span>
              </Button>
            </Link>
            <Link href="/admin/gen-ai-space">
              <Button
                variant={pathname === '/admin/gen-ai-space' ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Monitor className="w-4 h-4" />
                <span>Admin Panel</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Navigation;