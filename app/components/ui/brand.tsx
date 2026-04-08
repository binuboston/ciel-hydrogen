import * as React from 'react';
import {cn} from '~/lib/utils';

export function BrandContainer({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  );
}

export function BrandPageSection({
  className,
  ...props
}: React.ComponentProps<'section'>) {
  return (
    <section className={cn('py-6 md:py-8', className)} {...props} />
  );
}
