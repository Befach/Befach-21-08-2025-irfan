# 🧪 Testing Guide for Shipment Tracker

This guide covers all the testing options available in your shipment tracking application.

## 📋 Testing Overview

Your application supports multiple types of testing:

1. **Email System Testing** (Built-in)
2. **API Health Checks** (Built-in)
3. **Unit Testing** (Jest + React Testing Library)
4. **Integration Testing** (Jest)
5. **End-to-End Testing** (Playwright)
6. **Manual Testing**

## 🚀 Quick Start Testing

### 1. Install Testing Dependencies

```bash
npm install
```

### 2. Run All Tests

```bash
# Unit and integration tests
npm test

# Email system tests
npm run test:email

# End-to-end tests
npm run test:e2e
```

## 📧 Email System Testing

Your application has a robust email testing system already built-in:

### Basic Email Test

```bash
# Compile TypeScript first
npm run build:ts

# Run email tests
npm run test:email
```

### What Email Tests Cover

- ✅ SMTP connection verification
- ✅ Shipment creation emails
- ✅ Status update emails
- ✅ Custom email sending
- ✅ Error handling

### Customizing Email Tests

Edit `src/test-email.ts` to:
- Change test email address (line 20)
- Add more test scenarios
- Test different email templates

## 🔍 API Testing

### Health Check

```bash
# Start development server
npm run dev

# Test API health
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "API is working",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Available Test Endpoints

- `/api/health` - Basic health check
- `/api/test-email` - Email functionality test
- `/api/test-webhook` - Webhook functionality test
- `/api/test-zoho-webhook` - Zoho webhook test

## 🧪 Unit & Integration Testing

### Running Jest Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
__tests__/
├── components/          # Component tests
│   └── Layout.test.tsx
├── api/                # API endpoint tests
│   └── health.test.ts
└── lib/                # Utility function tests
```

### Writing New Tests

#### Component Test Example

```typescript
import { render, screen } from '@testing-library/react'
import YourComponent from '../../components/YourComponent'

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

#### API Test Example

```typescript
import { createMocks } from 'node-mocks-http'
import handler from '../../pages/api/your-endpoint'

describe('/api/your-endpoint', () => {
  it('handles GET request', async () => {
    const { req, res } = createMocks({ method: 'GET' })
    await handler(req, res)
    expect(res._getStatusCode()).toBe(200)
  })
})
```

## 🌐 End-to-End Testing

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### E2E Test Structure

```
e2e/
├── home.spec.ts        # Home page tests
├── admin.spec.ts       # Admin dashboard tests
└── tracking.spec.ts    # Tracking functionality tests
```

### Writing E2E Tests

```typescript
import { test, expect } from '@playwright/test'

test('user can track shipment', async ({ page }) => {
  await page.goto('/')
  await page.fill('[placeholder="Enter tracking number"]', 'TRK12345678')
  await page.click('button:has-text("Track")')
  await expect(page.locator('.tracking-result')).toBeVisible()
})
```

## 🖱️ Manual Testing

### Frontend Testing Checklist

1. **Home Page** (`/`)
   - [ ] Page loads correctly
   - [ ] Tracking form works
   - [ ] Navigation links work
   - [ ] Responsive design

2. **Tracking Page** (`/track`)
   - [ ] Enter tracking number
   - [ ] View shipment details
   - [ ] Timeline displays correctly
   - [ ] Error handling for invalid numbers

3. **Admin Dashboard** (`/admin`)
   - [ ] Login functionality
   - [ ] View shipments list
   - [ ] Create new shipment
   - [ ] Edit shipment details
   - [ ] Email testing interface

### API Testing Checklist

1. **Health Endpoint**
   - [ ] Returns 200 status
   - [ ] Contains expected fields

2. **Email Endpoints**
   - [ ] Send test email
   - [ ] Handle invalid email addresses
   - [ ] Error responses

3. **Webhook Endpoints**
   - [ ] Accept webhook data
   - [ ] Process webhook events
   - [ ] Return appropriate responses

## 🔧 Testing Configuration

### Environment Variables for Testing

Create `.env.test` for testing:

```bash
# Test database
NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-key

# Test email
SMTP_USER=test@example.com
SMTP_PASS=test-password

# Test webhook
WEBHOOK_SECRET=test-secret
```

### Jest Configuration

- `jest.config.js` - Main Jest configuration
- `jest.setup.js` - Test environment setup
- Coverage reports in `coverage/` directory

### Playwright Configuration

- `playwright.config.ts` - E2E test configuration
- Supports multiple browsers (Chrome, Firefox, Safari)
- Automatic server startup for tests

## 📊 Test Coverage

### Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: Main user journeys covered

### Viewing Coverage

```bash
npm run test:coverage
```

Open `coverage/lcov-report/index.html` in browser to view detailed coverage.

## 🐛 Debugging Tests

### Debug Jest Tests

```bash
# Run specific test file
npm test -- Layout.test.tsx

# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Debug E2E Tests

```bash
# Run with headed browser
npx playwright test --headed

# Run with debug mode
npx playwright test --debug
```

### Common Issues

1. **Environment Variables**: Ensure test env vars are set
2. **Database Connections**: Use test database for tests
3. **Async Operations**: Use proper async/await in tests
4. **Mocking**: Mock external services appropriately

## 📝 Best Practices

### Test Organization

- Group related tests using `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Test Data

- Use factories for test data
- Clean up test data after tests
- Use unique identifiers for test data

### Performance

- Mock heavy operations
- Use test databases
- Avoid testing implementation details

## 🚀 Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:ts
      - run: npm test
      - run: npm run test:e2e
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Next.js Testing](https://nextjs.org/docs/testing)

---

**Happy Testing! 🎉** 