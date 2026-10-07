import { ArrowRight, Code2, Layers3 } from 'lucide-react';
import { articles, articlePath, t, type Locale } from '@/content';
import { NavigationLink as Link } from '@/navigation';

export function Introduction({ locale }: { locale: Locale }) {
  return (
    <>
      <div className="intro-visual" aria-hidden="true">
        <div className="visual-grid" />
        <div className="visual-label">RUST × CHROMIUM</div>
        <div className="stone stone-one" />
        <div className="stone stone-two" />
        <div className="stone stone-three" />
        <div className="visual-bottom">
          <span>
            WEB.
            <br />
            NATIVE.
            <br />
            TOGETHER.
          </span>
          <span className="visual-number">01 / TUFFITE</span>
        </div>
      </div>
      <div className="path-cards">
        <Link
          className="path-card"
          to={articlePath(
            articles.find((a) => a.slug === 'guides/create-app')!,
            locale,
          )}
        >
          <div className="path-card-icon">
            <Code2 size={20} />
            <ArrowRight size={16} />
          </div>
          <h3>{t('Build an application', '构建应用')[locale]}</h3>
          <p>
            {
              t(
                'Rust logic. Web interfaces. One typed contract.',
                'Rust 逻辑、Web 界面，一个类型化契约。',
              )[locale]
            }
          </p>
          <span>
            {t('Application guide', '应用开发指南')[locale]} <ArrowRight size={12} />
          </span>
        </Link>
        <Link
          className="path-card"
          to={articlePath(
            articles.find((a) => a.slug === 'guides/framework')!,
            locale,
          )}
        >
          <div className="path-card-icon">
            <Layers3 size={20} />
            <ArrowRight size={16} />
          </div>
          <h3>{t('Shape the framework', '参与框架开发')[locale]}</h3>
          <p>
            {
              t(
                'Chromium integration, native features, and tooling.',
                'Chromium 集成、原生能力与开发工具。',
              )[locale]
            }
          </p>
          <span>
            {t('Contributor guide', '贡献者指南')[locale]} <ArrowRight size={12} />
          </span>
        </Link>
      </div>
    </>
  );
}
