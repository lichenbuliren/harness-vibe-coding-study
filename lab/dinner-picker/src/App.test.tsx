import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('Dinner Picker app', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('shows an empty state before dishes are added', () => {
    render(<App />)

    expect(screen.getByText('池子还空着')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '今天吃什么' })).toBeDisabled()
  })

  it('adds a dish to the pool', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('添加一道菜'), '番茄炒蛋')
    await user.click(screen.getByRole('button', { name: '加进菜谱池' }))

    expect(screen.getByText('番茄炒蛋')).toBeInTheDocument()
    expect(screen.getByText('1 道')).toBeInTheDocument()
  })

  it('highlights the add button only when a dish name can be submitted', async () => {
    const user = userEvent.setup()
    render(<App />)

    const addButton = screen.getByRole('button', { name: '加进菜谱池' })

    expect(addButton).toBeDisabled()
    expect(addButton).toHaveAttribute('data-ready', 'false')

    await user.type(screen.getByLabelText('添加一道菜'), '青椒肉丝')

    expect(addButton).toBeEnabled()
    expect(addButton).toHaveAttribute('data-ready', 'true')
  })

  it('draws a random recommendation', async () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0)
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('添加一道菜'), '牛肉面')
    await user.click(screen.getByRole('button', { name: '加进菜谱池' }))
    await user.click(screen.getByRole('button', { name: '今天吃什么' }))

    expect(screen.getByText('今天就吃')).toBeInTheDocument()
    expect(screen.getAllByText('牛肉面')).toHaveLength(2)

    randomSpy.mockRestore()
  })

  it('deletes a dish from the pool', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('添加一道菜'), '寿司')
    await user.click(screen.getByRole('button', { name: '加进菜谱池' }))
    await user.click(screen.getByRole('button', { name: '删除 寿司' }))

    expect(screen.queryByText('寿司')).not.toBeInTheDocument()
    expect(screen.getByText('池子还空着')).toBeInTheDocument()
  })
})
