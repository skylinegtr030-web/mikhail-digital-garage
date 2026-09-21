export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json(
    {
      status: 'ok',
      service: 'mikhail-digital-garage',
      timestamp: new Date().toISOString()
    },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store' }
    }
  );
}
