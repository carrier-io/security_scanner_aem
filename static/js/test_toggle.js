const AemIntegration = {
    delimiters: ['[[', ']]'],
    props: ['instance_name', 'section', 'selected_integration', 'is_selected', 'integration_data'],
    emits: ['set_data', 'clear_data'],
    data() {
        return this.initialState()
    },
    computed: {
        body_data() {
            const {
                config,
                is_default,
                selected_integration: id,
                scanner_host,
                scanner_port,
                save_intermediates_to,
            } = this
            return {
                config,
                is_default,
                id,
                scanner_host,
                scanner_port,
                save_intermediates_to,
            }
        },
        scan_types_indeterminate() {
            return !(this.scan_types.length === 0 || this.scan_types.length === this.available_scan_types.length)
        }
    },
    watch: {
        selected_integration(newState, oldState) {
            console.debug('watching selected_integration: ', oldState, '->', newState, this.integration_data)
            this.set_data(this.integration_data.settings, false)
        }
    },
    methods: {
        get_data() {
            if (this.is_selected) {
                return this.body_data
            }
        },
        set_data(data, emit = true) {
            Object.assign(this.$data, data)
            emit&& this.$emit('set_data', data)
        },
        clear_data() {
            Object.assign(this.$data, this.initialState())
            this.$emit('clear_data')
        },

        handleError(response) {
            try {
                response.json().then(
                    errorData => {
                        errorData.forEach(item => {
                            console.debug('AEM item error', item)
                            this.error = {[item.loc[0]]: item.msg}
                        })
                    }
                )
            } catch (e) {
                alertCreateTest.add(e, 'danger-overlay')
            }
        },


        handle_select_all(e) {
            if (this.scan_types_indeterminate || !e.target.checked) {
                this.scan_types = []
                e.target.checked = false
            } else {
                this.scan_types = [...this.available_scan_types]
            }
        },
        handleScanTypeCheck(value, checked) {
            if (checked) {
                this.scan_types.push(value)
            } else {
                const i = this.scan_types.indexOf(value)
                this.scan_types.splice(i, 1)
            }
        },

        initialState: () => ({
            // toggle: false,
            config: {},
            error: {},

            scanner_host: "127.0.0.1",
            scanner_port: "4444",
            save_intermediates_to: '/data/intermediates/dast',
        })
    },
    template: `
        <div class="mt-3">
            <div class="row">
                <div class="col">
                    <h7>Advanced Settings</h7>
                    <p>
                        <h13>Integration default settings can be overridden here</h13>
                    </p>
                </div>
            </div>

            <div class="form-group">
                <div class="form-group form-row">
                    <div class="col-6">
                        <h9>Scanner Host</h9>
                        <p>
                            <h13>Optional</h13>
                        </p>
                        <input type="text" class="form-control form-control-alternative"
                            placeholder="127.0.0.1"
                            v-model="scanner_host"
                            :class="{ 'is-invalid': error.scanner_host }">
                        <div class="invalid-feedback">[[ error.scanner_host ]]</div>
                    </div>
                    <div class="col-6">

                        <h9>Scanner Port</h9>
                        <p>
                            <h13>Optional</h13>
                        </p>
                        <input type="text" class="form-control form-control-alternative"
                            placeholder="4444"
                            v-model="scanner_port"
                            :class="{ 'is-invalid': error.scanner_port }">
                        <div class="invalid-feedback">[[ error.scanner_port ]]</div>
                    </div>
                </div>
                
                <h9>Save intermediates to</h9>
                <p>
                    <h13>Optional</h13>
                </p>
                <input type="text" class="form-control form-control-alternative"
                    placeholder=""
                    v-model="save_intermediates_to"
                    :class="{ 'is-invalid': error.save_intermediates_to }">
                <div class="invalid-feedback">[[ error.save_intermediates_to ]]</div>
            </div>
        </div>
    `
}


register_component('scanner-aem', AemIntegration)

