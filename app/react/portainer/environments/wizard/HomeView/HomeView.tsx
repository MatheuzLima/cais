import { Wand2, Plug2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { EnvironmentType } from '@/react/portainer/environments/types';
import { APP_NAME } from '@/branding';
import DockerIcon from '@/assets/ico/vendor/docker-icon.svg?c';
import Kube from '@/assets/ico/kube.svg?c';

import { PageHeader } from '@@/PageHeader';
import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';
import { Link } from '@@/Link';

import { Option } from '../components/Option';

import { useConnectLocalEnvironment } from './useFetchOrCreateLocalEnvironment';
import styles from './HomeView.module.css';

export function HomeView() {
  const localEnvironmentAdded = useConnectLocalEnvironment();
  const { t } = useTranslation();
  return (
    <>
      <PageHeader
        title="Quick Setup"
        breadcrumbs={[{ label: 'Environment Wizard' }]}
        reload
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <WidgetTitle title="Environment Wizard" icon={Wand2} />
            <WidgetBody>
              <div className="row">
                <div className="col-sm-12 form-section-title">
                  {t('Welcome to {{name}}', { name: APP_NAME })}
                </div>
                <div className="text-muted small">
                  {localEnvironmentAdded.status === 'success' && (
                    <p>
                      {t(
                        'We have connected your local environment of {{type}} to {{name}}.',
                        {
                          type: getTypeLabel(localEnvironmentAdded.type),
                          name: APP_NAME,
                        }
                      )}
                    </p>
                  )}

                  {localEnvironmentAdded.status === 'error' && (
                    <p>
                      {t(
                        'We could not connect your local environment to {{name}}.',
                        { name: APP_NAME }
                      )}
                      <br />
                      {t(
                        'Please ensure your environment is correctly exposed. For help with installation visit'
                      )}{' '}
                      <a
                        href="https://docs.portainer.io/start/intro"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://docs.portainer.io/start/intro
                      </a>
                    </p>
                  )}

                  <p>
                    {t(
                      'Get started below with your local environment or connect more container environments.'
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {localEnvironmentAdded.status === 'success' && (
                    <Link
                      to="portainer.home"
                      className={styles.link}
                      data-cy="wizard-get-started-link"
                    >
                      <Option
                        icon={
                          localEnvironmentAdded.type === EnvironmentType.Docker
                            ? DockerIcon
                            : Kube
                        }
                        title={t('Get Started')}
                        description={t(
                          'Proceed using the local environment which {{name}} is running in',
                          { name: APP_NAME }
                        )}
                      />
                    </Link>
                  )}
                  <Link
                    to="portainer.wizard.endpoints"
                    className={styles.link}
                    data-cy="wizard-add-environments-link"
                  >
                    <Option
                      title={t('Add Environments')}
                      icon={Plug2}
                      description={t('Connect to other environments')}
                    />
                  </Link>
                </div>
              </div>
            </WidgetBody>
          </Widget>
        </div>
      </div>
    </>
  );
}

function getTypeLabel(type?: EnvironmentType) {
  switch (type) {
    case EnvironmentType.Docker:
      return 'Docker';
    case EnvironmentType.AgentOnDocker:
      return 'Docker Agent';
    case EnvironmentType.KubernetesLocal:
      return 'Kubernetes';
    default:
      return '';
  }
}
