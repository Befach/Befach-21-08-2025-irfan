import { render, screen } from '@testing-library/react'
import Layout from '../../components/Layout'

describe('Layout Component', () => {
  it('renders children correctly', () => {
    const testContent = 'Test content'
    render(
      <Layout>
        <div>{testContent}</div>
      </Layout>
    )
    
    expect(screen.getByText(testContent)).toBeInTheDocument()
  })

  it('renders navigation', () => {
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    )
    
    // Check if navigation elements are present
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
}) 