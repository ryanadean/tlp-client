<template>
    <v-container
    fill-height
    fluid
    grid-list-sm>
        <v-layout
            justify-center
            wrap>
            <v-flex
                md6>
                <material-card 
                    color="cyan"
                    title="Settings"
                    light
                    >
                    <v-container>
                        <v-layout row wrap>
                            <v-flex md8>
                                <v-text-field
                                    :value="fileName"
                                    label="Filename"
                                    readonly
                                    :rules="[rules.isValidFile]"
                                    :change="saveSettings()"
                                    ></v-text-field>
                            </v-flex>
                            <v-flex md4 sm12>
                                <v-btn color="deep-orange darken-1" class="black--text" @click.native="openFileDialog"
                                :change="saveSettings()">
                                    Select Logfile
                                    <v-icon right dark>cloud_upload</v-icon>
                                </v-btn>
                            </v-flex>
                             <input type="file" id="file-upload" style="display:none" @change="onFileChange" accept=".txt"
                            :change="saveSettings()">
                        </v-layout>
                        <v-layout row wrap>
                            <v-flex>
                                <v-subheader>File Options</v-subheader>
                                    <v-checkbox v-model="autoDeleteDumps" label="Auto-remove raid and guild dumpfiles (disable if using EQDKP Plus)" 
                                    :change="saveSettings()"/>
                                    <v-radio-group v-model="logFileOptions" label="Log File pruning and Auto-Deletion" hint="Allows you to control how your data is stored, which can improve performance, but may affect interaction with other Everquest tools."
                                    :change="saveSettings()">
                                        <v-radio value="never">
                                            <template v-slot:label>
                                                <div>Never <span class="subtitle-1 font-weight-light font-italic">(This is a good option if you want to manually manage your logfiles yourself.)</span></div>
                                            </template>
                                        </v-radio>
                                        <v-radio value="instant">
                                            <template v-slot:label>
                                                <div>Instantly <span class="subtitle-1 font-weight-light font-italic">(This is a good option if you don't care about your logs and don't use other EQ tools).</span></div>
                                            </template>
                                        </v-radio>
                                        <v-radio value="archive">
                                            <template v-slot:label>
                                                <div>Archive <span class="subtitle-1 font-weight-light font-italic">(Will not delete logs, but move them periodically).</span></div>
                                            </template>
                                        </v-radio>
                                        <v-text-field v-if="!autoArchive" label="Archive trigger"  value="25" suffix="MB" solo v-model="archiveSize"
                                            :change="saveSettings()"></v-text-field>
                                    </v-radio-group>
                            </v-flex>
                        </v-layout>
                        <v-divider></v-divider>
                        <v-subheader>Connection Info</v-subheader>
                        <v-layout row wrap>
                            <v-flex>
                                <v-text-field
                                    v-model="code"
                                    :rules="[rules.required]"
                                    :change="saveSettings()"
                                    label="Connection Code"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </material-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import MaterialCard from './material/Card'
import Parser from '../lib/parser'
import $socket from '../lib/socket-instance'
import _ from 'lodash'
import settings from 'electron-settings'

export default {
    components: {
        MaterialCard,
    },
    data: () => ({
        formData: new FormData(),
        fileName: settings.get('logfile'),
        filePath: settings.get('logpath'),
        show: false,
        rules: {
            isValidFile: value => (!value || _.startsWith(value, "eqlog_"))  || 'Not a valid EQ logfile',
            required: value => !value || 'Required',
            min: value => value.length > 8 || '8 Characters or more'
        },
        logFileOptions: settings.get('logAutoDelete'),
        autoDeleteDumps: settings.get('autoDeleteDumps'),
        password: settings.get('password'),
        archiveSize: settings.get('archiveSize'),
        code: settings.get('code'),

    }),
    computed: {
        autoArchive() {
            return this.logFileOptions !== 'archive'
        }
    },
    methods: {
        openFileDialog() {
            document.getElementById('file-upload').click();
        },
        onFileChange(e) {
            var self = this;
            var files = e.target.files || e.dataTransfer.files;       
            if(files.length > 0){
                for(var i = 0; i< files.length; i++){
                    self.formData.append("file", files[i], files[i].name);
                    self.setFile(files[i].name, files[i].path)
                }
            }   
        },
        uploadFile() {
            var self = this; 
        },
        setFile(name, path) {
            this.fileName = name
            this.filePath = path
        },
        saveSettings() {
            if (settings.get('logfile') != this.fileName)  this.$store.parser = new Parser(this.filePath, $socket )
            settings.setAll({
                logfile: this.fileName,
                logpath: this.filePath,
                autoDeleteDumps: this.autoDeleteDumps,
                logAutoDelete: this.logFileOptions,
                archiveSize: this.archiveSize,
                code: this.code,
            })

            // Force the parser to be null
           
        }
    },
}
</script>