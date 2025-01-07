'use client';

import { Section, Cell, Image, List } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';
import { useSignal, initData, type User } from '@telegram-apps/sdk-react';

import { Link } from '@/components/Link/Link';
import { LocaleSwitcher } from '@/components/LocaleSwitcher/LocaleSwitcher';
import { Page } from '@/components/Page';

import tonSvg from './_assets/ton.svg';
import type {DisplayDataRow} from "@/components/DisplayData/DisplayData";

export default function Home() {
  const t = useTranslations('i18n');
  const user = useSignal(initData.user); // Предполагается, что initData.user содержит данные пользователя

  return (
    <Page back={false}>
      <List>
        <Section
          header="Мой профиль"
          footer=""

        >
          <Link href="/profile">
            <Cell
              before={
                <Image
                  src={user?.photoUrl}
                  style={{ backgroundColor: '#fff' }}
                />
              }
              subtitle={user?.isPremium ? 'Активен Telegram Premium' : 'Обычный пользователь'}
            >
              {`${user?.firstName} ${user?.lastName}`}

            </Cell>
          </Link>
        </Section>
        <Section
            header="Мини-игры"
            footer="Погрузитесь в мир увлекательных мини-игр, доступных прямо в нашем приложении! Эти игры помогут вам расслабиться и весело провести время. "
        >
          <Link href="game/dice">
            <Cell subtitle="Испытайте удачу в классической игре 'Кости'! Бросайте кубики и старайтесь набрать как можно больше очков. Эта простая, но увлекательная игра идеально подходит для коротких перерывов и поможет вам отвлечься от повседневных забот. Попробуйте свои силы и узнайте, насколько вы везучи!">
              Кости
            </Cell>
          </Link>
        </Section>


      </List>
    </Page>
  );
}
