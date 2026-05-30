import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Trash2 } from 'lucide-react'
import { dishTags, tagLabels, type Dish, type DishTag } from '../lib/dishes'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({
  className = '',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      'bg-[#f25f4c] text-white shadow-[0_16px_30px_rgba(242,95,76,0.28)] hover:bg-[#db4c3d]',
    secondary:
      'bg-white text-[#102a43] ring-1 ring-[#d7dee8] hover:bg-[#f5f8fb]',
    ghost: 'bg-transparent text-[#52606d] hover:bg-[#eef4f8]',
  }

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  )
}

type InputProps = ComponentPropsWithoutRef<'input'>

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`min-h-12 w-full rounded-2xl border border-[#d7dee8] bg-white px-4 text-base text-[#102a43] outline-none transition placeholder:text-[#9aa6b2] focus:border-[#15aabf] focus:ring-4 focus:ring-[#15aabf]/15 ${className}`}
      {...props}
    />
  )
}

type PanelProps = {
  children: ReactNode
  className?: string
}

export function Panel({ children, className = '' }: PanelProps) {
  return (
    <section
      className={`rounded-[28px] border border-white/70 bg-white/88 p-4 shadow-[0_18px_50px_rgba(16,42,67,0.12)] backdrop-blur ${className}`}
    >
      {children}
    </section>
  )
}

type TagSelectProps = {
  value: DishTag
  onChange: (value: DishTag) => void
}

export function TagSelect({ value, onChange }: TagSelectProps) {
  return (
    <div className="grid grid-cols-3 gap-2" aria-label="菜品标签">
      {dishTags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onChange(tag)}
          className={`min-h-10 rounded-full px-3 text-sm font-bold transition ${
            value === tag
              ? 'bg-[#15aabf] text-white shadow-[0_10px_22px_rgba(21,170,191,0.26)]'
              : 'bg-[#eef4f8] text-[#52606d]'
          }`}
        >
          {tagLabels[tag]}
        </button>
      ))}
    </div>
  )
}

type DishCardProps = {
  dish: Dish
  onDelete: (dishId: string) => void
}

export function DishCard({ dish, onDelete }: DishCardProps) {
  return (
    <article className="flex items-center justify-between gap-3 rounded-2xl bg-[#f7fafc] p-3">
      <div className="min-w-0">
        <h3 className="truncate text-base font-bold text-[#102a43]">
          {dish.name}
        </h3>
        <p className="mt-1 text-xs font-bold text-[#15aabf]">
          {tagLabels[dish.tag]}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onDelete(dish.id)}
        className="grid size-10 shrink-0 place-items-center rounded-full text-[#7b8794] transition hover:bg-[#ffe8e2] hover:text-[#c0392b]"
        aria-label={`删除 ${dish.name}`}
      >
        <Trash2 size={18} />
      </button>
    </article>
  )
}
