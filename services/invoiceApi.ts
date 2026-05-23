export async function calculateInvoiceTotal(
  payload: any
): Promise<string> {

  try {

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/invoice/total`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    const text = await response.text();

    if (!response.ok) {
      throw new Error(text);
    }

    return text;

  } catch (error) {

    console.error('API Error:', error);

    throw new Error(
      'Error 500 : Backend service is unavailable'
    );
  }
}