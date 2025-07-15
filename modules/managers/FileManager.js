// E.g. Sync camera runtime → state
//app.state.camera.position = app.runtime.camera.position.toArray()
//app.state.camera.zoom = app.runtime.camera.zoom
// Interface with app.state, not runtime.

export default class FileManager {
  constructor(app) {
    this.app = app
  }

  save() {
    const stateData = JSON.stringify(this.app.state, null, 2)
    const blob = new Blob([stateData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'scene.json'
    a.click()

    URL.revokeObjectURL(url)
  }

  load(file) {
    const reader = new FileReader()
    reader.onload = () => {
      const parsed = JSON.parse(reader.result)
      this.app.state = parsed
      this.app.managers.scene.rebuildFromState()
    }
    reader.readAsText(file)
  }
}
