import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from './button';

function Pagination({ className = '', ...props }) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={`mx-auto flex w-full justify-center ${className}`}
      {...props}
    />
  );
}

function PaginationContent({ className = '', ...props }) {
  return (
    <ul
      className={`flex flex-row items-center gap-1 ${className}`}
      {...props}
    />
  );
}

function PaginationItem({ ...props }) {
  return <li {...props} />;
}

function PaginationLink({ className = '', isActive = false, size = 'icon', ...props }) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variantClasses = isActive
    ? 'border border-gray-400 bg-white text-gray-900 hover:bg-gray-50'
    : 'bg-transparent text-gray-900 hover:bg-gray-100';
  const sizeClasses = size === 'icon' ? 'h-10 w-10' : 'h-10 py-2 px-4';

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    />
  );
}

function PaginationPrevious({ className = '', ...props }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={`gap-1 px-2.5 sm:pl-2.5 ${className}`}
      {...props}
    >
      <ChevronLeft className="w-4 h-4" />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({ className = '', ...props }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={`gap-1 px-2.5 sm:pr-2.5 ${className}`}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRight className="w-4 h-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className = '', ...props }) {
  return (
    <span
      aria-hidden
      className={`flex w-9 h-9 items-center justify-center ${className}`}
      {...props}
    >
      <MoreHorizontal className="w-4 h-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
