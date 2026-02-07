import { OAuth2Client } from 'google-auth-library'
import crypto from 'node:crypto'

export default defineEventHandler(async (event) => {
  const { req, res } = event.node
  console.log('Google OAuth2 callback event: url=', req.url)

  const config = useRuntimeConfig()
  const CLIENT_ID = config.public.googleClientId;
  const client = new OAuth2Client(CLIENT_ID);

  const body = await readBody<{ token: string }>(event);
  const code = body.token;
  if (!code) {
      return setResponseStatus(event, 401, 'empty Token'); // { success: false, message: "缺少 Token" };
  }

  try {
      // 1. 驗證 ID Token
      const ticket = await client.verifyIdToken({
          idToken: code,
          audience: CLIENT_ID,  // 指定此 Token 必須是發給你的 App 的
      });

      // 2. 取得使用者資訊 (Payload)
      const payload = ticket.getPayload();
      
      // payload 包含以下常用資訊：
      // payload.sub (Google 的唯一使用者 ID)
      // payload.email (使用者信箱)
      // payload.name (使用者姓名)
      // payload.picture (大頭貼網址)

      console.log("驗證成功，使用者資訊：", payload);

      // 3. (商業邏輯) 在這裡查詢資料庫
      // const user = await db.findUserByEmail(payload.email);
      // if (!user) { ... 建立新帳號 ... }
      const token = crypto.randomUUID() // 模擬建立一個新的 Token
      // 4. (商業邏輯) 建立你自己的系統 Session 或 JWT
      // const myAppToken = createMyAppJwt(user);
      setCookie(event, 'my_app_token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 天
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
      })
      // 5. 回傳成功訊息給前端
      return {
          success: true,
          user: {
              userId: payload?.sub ?? '沒有 ID',
              name: payload?.name ?? '沒有名字',
              email: payload?.email ?? '沒有信箱',
              picture: payload?.picture ?? '',
          },
          token
      };

  } catch (error) {
      console.error("Token 驗證失敗:", error);
      return { success: false, message: "無效的 Google Token", user: null };
  }
})