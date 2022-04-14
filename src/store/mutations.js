export default {
  save_map(state, map) {
    state.map = map
  },
  saveRouteData(state, data) {
    state.route_data = data
  },
  showLoading(state) {
    state.is_loading = true
  },
  hideLoading(state) {
    state.is_loading = false
  }
}