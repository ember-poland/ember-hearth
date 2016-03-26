import Ember from 'ember';

const {inject} = Ember;

export default Ember.Controller.extend({
  ipc: inject.service(),
  electron: inject.service(),

  path: '',
  addon: false,
  installing: false,
  stdout: '',
  stderr: '',
  lastStdout: '',

  init(){
    this._super(...arguments);

    this.get('ipc').on('project-init-start', () => {
      this.set('installing', true);
    });
    this.get('ipc').on('project-init-end', (ev, project) => {
      this.set('installing', false);
      this.transitionToRoute('project.detail', this.get('store').peekRecord('project', project.data.id));
    });
    this.get('ipc').on('project-init-stdout', (ev, data) => {
      this.set('stdout', this.get('stdout') + data);
      this.set('lastStdout', data);
    });
    this.get('ipc').on('project-init-stderr', (ev, data) => {
      this.set('err', this.get('stdout') + data);
    });
  },

  actions: {
    changedPath(path) {
      this.set('path', path);
    },
    initProject(){
      let path = this.get('path');

      if (path) {
        this.get('ipc').trigger('hearth-init-project', {
          path: path,
          addon: false
        });
      }
    }
  }
});