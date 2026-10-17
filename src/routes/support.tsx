import { createFileRoute } from "@tanstack/react-router";

import { LegalPage } from "@/components/legal/legal-page";
import { APP_NAME, SUPPORT_EMAIL } from "@/lib/app-info";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: `Support · ${APP_NAME}` },
      { name: "description", content: `Help and contact for ${APP_NAME}.` },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  return (
    <LegalPage title="Support">
      <p>
        Need help with {APP_NAME} or found something wrong? Email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and we will reply as soon as we can.
        Please mention your iPhone model and what you were doing.
      </p>

      <h2>Common questions</h2>
      <h3>How do I start a new trip?</h3>
      <p>Open Planner, choose your dates, budget, interests and pace, then tap "Build my trip".</p>
      <h3>Why are some travel times marked as estimates?</h3>
      <p>
        When live road routing is unavailable (for example offline), times are estimated from
        distance. They update automatically when you are back online.
      </p>
      <h3>How do I get turn-by-turn directions?</h3>
      <p>Tap "Navigate" on a stop and choose Apple Maps or Google Maps.</p>
      <h3>How do I delete my data?</h3>
      <p>
        Everything is stored on your device. Deleting the app removes it. There is no account to
        close.
      </p>

      <h2>Поддержка по-русски</h2>
      <p>
        Пишите на <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>, ответим на русском.
      </p>

      <p>
        <a href="/privacy">Privacy Policy</a>
      </p>
    </LegalPage>
  );
}
