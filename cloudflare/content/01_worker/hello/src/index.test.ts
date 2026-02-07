import { describe, it, expect } from 'vitest';
import worker from './index';

describe('Hello Worker', () => {
  it('responds with Hello Cloudflare!', async () => {
    const req = new Request('http://example.com');
    const res = await worker.fetch(req, {}, {});
    expect(await res.text()).toBe('Hello Cloudflare!');
  });
});
