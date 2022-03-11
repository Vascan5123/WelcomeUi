import ExtensionPage from 'flarum/common/components/ExtensionPage';
import app from 'flarum/app';
import Switch from 'flarum/components/Switch';
import Button from 'flarum/components/Button';
import saveSettings from 'flarum/utils/saveSettings';
import isExtensionEnabled from 'flarum/utils/isExtensionEnabled';
import icon from 'flarum/helpers/icon';
import Alert from 'flarum/common/components/Alert';

export default class DefaultSettingsPage extends ExtensionPage {
  oninit(vnode) {
    super.oninit(vnode);

    // get welcome settings
    this.welcomeSettings = JSON.parse(app.data.settings["vascan.welcome_settings"] || null);

    if (!this.welcomeSettings) {
      this.welcomeSettings = {
        leftText: '',
        rightText: '',
        sliderItems: [],
      };
    }

    // is used when data is saving
    this.loading = false;
    // is used to check modification
    this.modified = false;

    // is used to check settings with with another settings dependencies
    this.settingStates = {
      // is used for sidebarmenu from IndexPage
      hideMainPageMenu: 0,
      // is used for toolbar from IndexPage
      hideToolBar: 0,
      // is used for sidebarmenu from DiscussionPage
      hideDiscussionMenu: 0,
    };

    this.sameValue = {}
  }

  content() {
    const allDiscussions = app.translator.trans('core.admin.basics.all_discussions_label');

    return (
      // standard containers on extensions page
      m('.ExtensionPage-settings', [
        m('.container', [
          // insert all in form tag
          m('Form', {
            // onsubmit action call onsubmit method
            onsubmit: this.onsubmit.bind(this),
          }, [
            m('.SettingsGroup', [ // contains all group settings
              m('.Welcome', [ // Start Welcome Settings
                m('label.hello', app.translator.trans('vascan-default.admin.welcome_settings.title')),
                Object.keys(this.welcomeSettings).map((key) => {
                  return m('.Form-group.' + key, [
                    m('label', app.translator.trans(`vascan-default.admin.welcome_settings.${key}`)),
                    m('.helpText', app.translator.trans(`vascan-default.admin.welcome_settings.${key}_text`)),
                    m(key === 'sliderItems' ? 'textarea.FormControl' : 'input.FormControl', {
                      type: key === 'sliderItems' ? undefined : 'text',
                      rows: key === 'sliderItems' ? 6 : undefined,
                      value: key === 'sliderItems' ? this.welcomeSettings[key].join('\n') : this.welcomeSettings[key],
                      placeholder: app.translator.trans('vascan-default.admin.welcome_settings.placeholder'),
                      oninput: (e) => {
                        key === 'sliderItems' ?
                          this.welcomeSettings[key] = e.target.value.split('\n') :
                          this.welcomeSettings[key] = e.target.value;
                        this.modified = true;
                      },
                    }),
                  ]);
                }),
              ]), // End Welcome Settings
             
              
            ]),
            // save button
            Button.component(
              {
                type: 'submit',
                className: 'Button Button--primary',
                loading: this.loading,
                disabled: !this.modified,
              },
              app.translator.trans('core.admin.edit_header.submit_button')
            ),
          ]),
        ])
      ])
    );
  }

  onsubmit(e) {
    e.preventDefault();
    this.loading = true;
    let k = 0;

    try {
      saveSettings({
        ["vascan.welcome_settings"]: JSON.stringify(this.welcomeSettings),
      });
      app.alerts.show(
        Alert,
        {
          type: "success"
        },
        app.translator.trans('core.admin.settings.saved_message')
      );
    } catch {
      app.alerts.show(
        Alert,
        {
          type: "error"
        },
        app.translator.trans('core.lib.error.generic_message')
      );
    } finally {
      this.welcomeSettings = JSON.parse(app.data.settings["vascan.welcome_settings"]);
      this.loading = false;
      this.modified = false;
    }
  }
}