import { LegalLayout } from "./legal-layout";
import { LegalSection } from "./legal-section";
import { LAST_UPDATED, CONTACT_EMAIL } from "./constants";

export function DataDeletionPage() {
  return (
    <LegalLayout title="Изтриване на данни" lastUpdated={LAST_UPDATED}>
      <p>
        Имате право да изтриете акаунта си и всички свързани лични данни по всяко
        време. По-долу е описано как.
      </p>

      <LegalSection heading="1. Изтриване през приложението">
        <p>
          Влезте в акаунта си, отворете страницата „Профил“ и натиснете „Изтрий
          профила“. След потвърждение акаунтът Ви и всички свързани данни се
          изтриват незабавно и необратимо.
        </p>
      </LegalSection>

      <LegalSection heading="2. Какво се изтрива">
        <p>
          Профилната Ви информация (име, имейл, профилна снимка), както и игрови
          данни като резултати, статистика и история на изиграните пъзели.
        </p>
      </LegalSection>

      <LegalSection heading="3. Заявка по имейл">
        <p>
          Ако нямате достъп до акаунта си, изпратете заявка за изтриване на{" "}
          <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          . Обработваме заявката в рамките на 30 дни.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
