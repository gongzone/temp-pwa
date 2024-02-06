import { Router, Request, Response, NextFunction } from "express";
import webpush from "web-push";

const VAPID_PUBLIC_KEY =
  "BLE6qpPNNgItrRuHo2qJLTqrK4bW0KcdPcrt3W76l8kHqjGxR6Bz13d2V5zXuFIEXUnUH3wF3jUg79PQFEED8ok";
const VAPID_PRIVATE_KEY = "zaYwkBwnaDQJVzBq497EZTMFm5-68m0tzE_o3I8RLHw";

webpush.setVapidDetails(
  "mailto:emailds-asad@gmail.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

const router = Router();

router.post("/token", (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body.token);
  res.status(200).send({ message: "success" });
});

router.get("/vapid-key", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ key: VAPID_PUBLIC_KEY });
});

router.post(
  "/subscription",
  (req: Request, res: Response, next: NextFunction) => {
    // 프로덕션에서는 subscription 정보를 영구적인 보관 장소에 저장해야함
    res.sendStatus(201);
  }
);

router.post("/reminder", (req: Request, res: Response, next: NextFunction) => {
  const { subscription, message, time } = req.body;
  let delay = new Date(time).getTime() - new Date().getTime();

  if (delay < 0) {
    return res.sendStatus(500);
  }

  console.log(subscription);

  // 푸시 알림 보내기
  setTimeout(() => {
    const payload = JSON.stringify({
      title: "Reminder",
      body: message,
    });

    if (subscription) {
      webpush
        .sendNotification(subscription, payload)
        .then(() => console.log("Reminder sent successfully."))
        .catch((err) =>
          console.error("Error sending notification, reason: ", err)
        );
    }
  }, delay);

  return res.sendStatus(200);
});

export { router };
