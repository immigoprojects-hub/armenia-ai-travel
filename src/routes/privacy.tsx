import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/legal/legal-page";
import { APP_NAME, POLICY_UPDATED, SUPPORT_EMAIL } from "@/lib/app-info";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy Policy · ${APP_NAME}` },
      { name: "description", content: `How ${APP_NAME} handles your data.` },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p className="text-sm opacity-70">Last updated: {POLICY_UPDATED}</p>
      <p>
        {APP_NAME} is a travel companion for Armenia, available as an iPhone app and on the web. You
        can use it without an account. We do not sell your data, show ads, or track you across other
        apps and websites.
      </p>

      <h2>What stays on your device</h2>
      <ul>
        <li>
          Your trip plan, dates, saved places, booking checklist and language choice are stored only
          on your device. Deleting the app (or clearing this site's data in your browser) removes
          them.
        </li>
        <li>Messages you type to Ara are answered on your device and are not sent to us.</li>
      </ul>

      <h2>Location</h2>
      <p>
        If you tap "Show my location" on the map and allow access, your position is used on your
        device to show where you are on today's route. It is not sent to us or stored. You can turn
        location access off at any time in your iPhone Settings.
      </p>

      <h2>What is sent to our server</h2>
      <p>
        To show road travel times and up-to-date place details and photos, the app sends the places
        in your plan (not your location) to our server, which asks openrouteservice for routes and
        Google Places for place information. These requests contain no name, email or other personal
        details.
      </p>
      <p>
        Like any website, our hosting provider (Vercel) processes standard technical data such as IP
        address and device type to deliver these requests and keep the service secure. We do not use
        this data to identify you, and the app contains no analytics or advertising SDKs.
      </p>

      <h2>Other services</h2>
      <ul>
        <li>Map tiles are loaded from OpenStreetMap and fonts from Google Fonts.</li>
        <li>
          Links such as directions in Google Maps or Apple Maps open those services, where their own
          privacy policies apply.
        </li>
      </ul>

      <h2>Children</h2>
      <p>
        {APP_NAME} is not directed at children under 13 and does not knowingly collect their data.
      </p>

      <h2>Changes and contact</h2>
      <p>
        If this policy changes, we will update this page and the date above. Questions:{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>

      <h2>Кратко по-русски</h2>
      <p>
        Аккаунт не нужен. План поездки, сохранённые места и язык хранятся только на вашем
        устройстве. Геолокация используется только на устройстве, чтобы показать вас на карте, и
        никуда не отправляется. На наш сервер уходят только места из плана, чтобы получить время в
        пути (openrouteservice) и данные о местах (Google Places). Рекламы, трекинга и аналитики
        нет. Вопросы: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
