'use server'

export async function checkAdminCredentials(email: string, pass: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPass && email === adminEmail && pass === adminPass) {
    return { success: true };
  }
  return { success: false };
}
