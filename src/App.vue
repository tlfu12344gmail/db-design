<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { fabric } from 'fabric';
import { nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import useClipboard from 'vue-clipboard3';



</script>

 <!-- <template>
   <div>
        <RouterLink to="/"></RouterLink>
        <RouterLink to="/about">About</RouterLink> 
    </div>

  <RouterView />
  <div> </div>
</template> -->
<template>
  <div class="col-flex">
    <div class="row-flex" style="width: 100%;height: 2.5rem;background-color:#f6f7f8;position:fixed;z-index: 1000;align-items: center;">
      <div style="margin-right: auto;padding-left: 0.5rem;">
        <el-button type="primary" @click="save(null, true)">save</el-button>
        <!-- <el-button type="primary" @click="setCanvasWH(1500, 1000)">set wh</el-button> -->
        <!-- <el-button type="primary" @click="changeDrawType('arrow')">add line</el-button>
        <el-button type="primary" @click="changeDrawType('drawing')">drawing</el-button>
        <el-button type="primary" @click="changeDrawType('table')">Add Table</el-button>
        <el-button type="primary" @click="changeDrawType('text')">Add Text</el-button> -->
       
        <!-- <el-button type="primary" @click="changeCursor('crosshair')">cursor</el-button>
        <el-button type="primary" @click="changeCursor('default')">default</el-button> -->
        <el-button type="primary" @click="exportImages('png')">export to png</el-button>
        <el-button type="primary" @click="exportSql()">export sql</el-button>

        <el-button type="primary" @click="zoom(true)">zoom in</el-button>
        <el-button type="primary" @click="zoom(false)">zoom out</el-button>

        <el-button type="primary" @click="copySelectSql(false)">copy selected sql</el-button>

      </div>
      <div ><el-input type="number" v-model="canvasWH.w"   @blur="cwInput"></el-input></div>
      <div> <el-icon style="vertical-align: middle;margin-top: 0.1rem;" color="black" size="20">
              <Close />
            </el-icon></div>
       <div style="padding-right: 0.5rem;"><el-input type="number" v-model="canvasWH.h"   @blur="chInput"></el-input></div> 
    </div>
    <div style="width: 100%;height: 2rem;"></div>
    <div class="row-flex">
      <div class="col-flex" style="width:15%; border-right: rgb(165, 149, 149) solid;border-right-width: 0.1rem;">
        <div class="row-flex"
          style="height: 20vh;border-bottom: rgb(165, 149, 149) solid;border-right-width: 0.1rem;flex-wrap: wrap;justify-content: space-between;">
          <img class="tool-img" :src="tools.pencilPath" @click="changeDrawType('drawing')" />
          <img class="tool-img" :src="tools.textPath" @click="changeDrawType('text')" />
          <img class="tool-img" :src="tools.arrowPath" @click="changeDrawType('arrow')" />
          <img class="tool-img" :src="tools.tablePath" @click="changeDrawType('table')" />

        </div>
        <div style="height: 80vh;">
          <el-tree ref="tree" :data="treeData" default-expand-all node-key="id" highlight-current="true"
            check-on-click-node="true" current-node-key="2" @node-click="swichSpace()" />
          <div style="position:fixed;bottom: 0.1rem;" class="row-flex">
            <div style="width: 80%;">
              <el-input v-model="spaceInput" size="small" placeholder="space" />
            </div>
            <el-icon style="vertical-align: middle;margin-right: 0.1rem;margin-top: 0.1rem;" color="blue" size="20"
              @click="addSpace()">
              <Plus />
            </el-icon>
            <el-icon style="vertical-align: middle;margin-top: 0.1rem;" color="red" size="20" @click="deleteSpace()">
              <Close />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="canvasDiv" id="canvasWrap">
        <canvas id="canvas" width="2000" height="4000"></canvas>
      </div>
    </div>
  </div>


  <!-- <el-dialog v-model="dialogTableVisible" title="Shipping address" draggable="true" :close-on-click-modal="false"
    :showClose="false">
    {{ currentTable.id }}
    {{  currentTable.item(0).item(1).text}}
    {{  currentTable.item(1).item(1).text}}
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogTableVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveTable()">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog> -->
  <el-drawer v-model="drawer" direction="btt" :show-close="false" size="70%" :close-on-click-modal="false"
    :with-header="false" :destroy-on-close="true">
    <!-- <template #header>
      <h4>set title by slot</h4>
    </template> -->
    <template #default>
      <div class="row-flex" style="margin-bottom: 1rem;">
        <div style="margin-right: 2rem;"> <el-input v-model="Schema" class="w-50 m-2" placeholder="Schema" /></div>
        <div style="margin-right: 2rem;"> <el-input v-model="TableName" class="w-50 m-3" placeholder="TableName"
            style="width:20rem" /></div>
        <div> <el-input v-model="TableComment" class="w-50 m-2" placeholder="TableComment" /></div>
      </div>

      <el-tabs type="border-card">
        <el-tab-pane label="Column">
          <el-table ref="table" height="350" :data="tableData" style="width: 100%;" :border="true" :header-cell-style="{
            background: '#e2d2d2', color: '#000000', border: '1px solid tan'
          }">
            <!-- <el-table-column type="selection" width="55" /> -->
            <el-table-column prop="Column" label="Column" width="150">
              <template #default="scope">
                <el-input :model-value="scope.row.Column" @input="value => handleInputChange(value, scope.$index, 1)" />
              </template>

            </el-table-column>
            <el-table-column prop="DataType" label="DataType" width="200">
              <template #default="scope">
                <el-select @blur="e => handleInputChange(e.target.value, scope.$index, 2)" filterable allow-create
                  v-model="scope.row.DataType" placeholder="Select"
                  @change="value => handleInputChange(value, scope.$index, 2)">
                  <el-option v-for="item in options" :key="item" :label="item" :value="item" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="PK" label="PK" width="50">
              <template #default="scope">
                <el-checkbox v-model="scope.row.PK" size="large"
                  @change="value => handleInputChange(value, scope.$index, 3)" />
              </template>
            </el-table-column>
            <el-table-column prop="NN" label="NN" width="50">
              <template #default="scope">
                <el-checkbox v-model="scope.row.NN" size="large"
                  @change="value => handleInputChange(value, scope.$index, 4)" />
              </template>
            </el-table-column>
            <el-table-column prop="UQ" label="UQ" width="50">
              <template #default="scope">
                <el-checkbox v-model="scope.row.UQ" size="large"
                  @change="value => handleInputChange(value, scope.$index, 5)" />
              </template>
            </el-table-column>
            <el-table-column prop="AI" label="AI" width="50">
              <template #default="scope">
                <el-checkbox v-model="scope.row.AI" size="large"
                  @change="value => handleInputChange(value, scope.$index, 6)" />
              </template>
            </el-table-column>

            <el-table-column prop="Default" label="Default" width="120">
              <template #default="scope">
                <el-input :model-value="scope.row.Default" @input="value => handleInputChange(value, scope.$index, 7)" />
              </template>
            </el-table-column>
            <el-table-column prop="Comment" label="Comment" width="400">
              <template #default="scope">
                <el-input :model-value="scope.row.Comment" @input="value => handleInputChange(value, scope.$index, 8)" />
              </template>
            </el-table-column>

            <el-table-column fixed="right" label="Operations" width="140">
              <template #default="scope">
                <el-icon style="vertical-align: middle;margin-right: 1rem;" color="red" size="20"
                  @click="deleteRow(scope.$index)">
                  <Delete />
                </el-icon>
                <el-icon v-if="scope.$index > 0" style="vertical-align: middle;margin-right: 1rem;" color="blue" size="20"
                  @click="swap(scope.$index, 1)">
                  <Top />
                </el-icon>
                <el-icon v-if="scope.$index < tableData.length - 1" style="vertical-align: middle;" color="blue" size="20"
                  @click="swap(scope.$index, 0)">
                  <Bottom />
                </el-icon>

              </template>
            </el-table-column>
          </el-table>
          <el-icon style="vertical-align: middle;margin-right: 2rem;margin-top: 1rem;" color="blue" size="20"
            @click="addRow()">
            <Plus />
          </el-icon>

        </el-tab-pane>
        <el-tab-pane label="Index">Index</el-tab-pane>

      </el-tabs>


    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
        <el-button type="primary" @click="saveTable()">confirm</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script>

//fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
fabric.Object.prototype.transparentCorners = false;




// fabric.Object.prototype.set({
//   cornerStrokeColor: "#66b0ef",
//   cornerColor: "#60abec",
//   cornerStyle: "rectangele",
//   cornerSize: 8,
//   borderScaleFactor: 2,
//   transparentCorners: false,
//   borderColor: "#61abe8",
// });
const Store = require('electron-store');

const { toClipboard } = useClipboard();

const store = new Store();
console.log(store.path);
const electron = require('electron');
const { dialog } = require("@electron/remote");
const fs = require('fs');

const ipc = electron.ipcRenderer;
let editorCanvas = null;
let factor = 1;
let mouseTo = {};
let mouseFrom = {};
let drawingObject = null;
let moveCount = 1;
let drawType = null;
let config = { "THColor": "gray", "TFColor": "#FFFFFF", "rx": 10, "ry": 10, "TWidth": 200 }
let currentSpace = 2;
let op = ["INT", "VARCHAR", "DECIMAL", "DATETIME", "DATE", "TIME", "CHAR", "BIGINT", "TIMESTAMP", "TEXT", "TINYINT", "BOOL", "BOOLEAN", "SMALLINT", "MIDDLEINT"]
export default {
  onload() {
    //console.log("success");
  },
  data() {
    return {
      canvasWH:{},
      treeData: [
        {
          id: 1,
          label: 'space',
          children: [
            {
              id: 2,
              label: 'default'
            }
          ],
        }
      ],
      tools: {
        tablePath: "./images/table.png",
        arrowPath: "./images/arrow.png",
        textPath: "./images/text.png",
        pencilPath: "./images/pencil.png",
      },
      spaceInput: "",
      dialogTableVisible: false,
      drawer: false,
      currentTable: null,
      Schema: "",
      TableName: "",
      TableComment: "",
      options: op.sort(),
      tableData: []
    };
  },
  mounted() {
    nextTick(() => {
      const td = store.get("treeData");
      if (td) {
        this.treeData = td;
      }
      const c = store.get("canvasConfig");
      if(c){
        config = c;
      }
      nextTick(() => {
        this.initeditorCanvas("2");
        this.$refs.tree.setCurrentKey('2');
      })
    });

    ipc.on('app-close', _ => {
      this.save(currentSpace);
      ipc.send('closed');
    });


  },
  methods: {
    cwInput(e){
      const cw = Number(e.target.value);
      if(cw<800){
        this.canvasWH.w=800;
      }
      if(cw>4000){
        this.canvasWH.w=4000;
      }
      this.setCanvasW(this.canvasWH.w);
    },
    chInput(e){
      const ch = Number(e.target.value);
      if(ch<800){
        this.canvasWH.h=800;
      }
      if(ch>4000){
        this.canvasWH.h=4000;
      }
      this.setCanvasH(this.canvasWH.h);
    },
    setCanvasW(w){
      editorCanvas.setWidth(w);
    },
    setCanvasH(h){
      editorCanvas.setHeight(h);
    },
    setCanvasWH(w, h) {
      editorCanvas.setWidth(w);
      editorCanvas.setHeight(h);
    },
    exportImages(type) {
      let base64 = editorCanvas.toDataURL({
        format: type,
      });
      base64 = base64.replace(/^data:image\/\w+;base64,/, "");
      dialog.showSaveDialog({
        title: '保存文件',
        defaultPath: new Date().getTime() + "." + type
      }).then(res => {
        const dataBuffer = new Buffer(base64, 'base64');
        fs.writeFile(res.filePath, dataBuffer, function (err) {
          if (err) {
            ElMessage.error("image export failed")
          } else {
            ElMessage({
              type: 'success',
              message: 'image export successfully!',
            })
          }
        });

      }).catch(err => {
        ElMessage.error("export failed")
      })

    },
    copySelectSql(){
      let sql = "";
      var tables  = editorCanvas.getActiveObjects();
      if(tables.length>0){
         for (let i = 0; i < tables.length; i++) {
            if (tables[i].name == "table") {
              sql = sql + tables[i].data.sql;
            }
          }
      }
      if(sql!=""){
        try {
         toClipboard(sql);
        ElMessage.success('复制成功')
      } catch (e) {
        ElMessage.warning('您的浏览器不支持复制：', e)
      }
      }

    },
    exportSql() {
      let that = this;
      dialog.showSaveDialog({
        title: '保存sql文件',
        defaultPath: new Date().getTime() + ".sql"
      }).then(res => {
        const tables = editorCanvas.getObjects("group");
        if (tables.length > 0) {
          let sql = "";
          for (let i = 0; i < tables.length; i++) {
            if (tables[i].name == "table") {
              sql = sql + tables[i].data.sql;
            }
          }
          fs.writeFileSync(res.filePath, sql);
        } else {
          ElMessage({
            message: 'no table is to be exported',
            type: 'warning',
          })
        }

        // 写入内容

        ElMessage({
          type: 'success',
          message: 'sql export successfully!',
        })
      }).catch(err => {
        ElMessage.error("export failed")
      })
    },


    paste(_clipboard, type, data) {
      let that = this;
      // clone again, so you can do multiple copies.
      _clipboard.clone(function (clonedObj) {
        editorCanvas.discardActiveObject();
        clonedObj.set({
          left: clonedObj.left + 20,
          top: clonedObj.top + 20,
          evented: true
        }, ['id', 'name', 'data']);
        if (clonedObj.type === 'activeSelection') {
          // active selection needs a reference to the canvas.
          clonedObj.canvas = editorCanvas;
          clonedObj.forEachObject(function (obj) {
            editorCanvas.add(obj);
          });
          // this should solve the unselectability
          clonedObj.setCoords();
        } else {
          editorCanvas.add(clonedObj);
        }
        // _clipboard.top += 20;
        // _clipboard.left += 20;
        if (type == "table") {
          clonedObj.set({ "id": new Date().getTime(), "name": "table", "data": data })
          that.addTableEvent(clonedObj);
        }
        editorCanvas.setActiveObject(clonedObj);
        // canvas.requestRenderAll();
      });
    },


    //克隆 复制
    clonecopy() {
      var _self = this;
      let activeObj = editorCanvas.getActiveObject();
      let type;
      if (!activeObj) {
        return;
      }
      let data = activeObj.data;
      type = activeObj.name;
      activeObj.clone(function (cloned) {
        _self.paste(cloned, type, data);
      });
      // canvas.renderAll();
    },

    deleteSpace() {
      const node = this.$refs.tree.getCurrentNode();
      if (node.id == 1 || node.id == 2) {
        ElMessage({
          message: 'current space can not be deleted!!',
          type: 'warning',
        })
        return;
      }
      let that = this;
      ElMessageBox.confirm(
        node.label + ' will permanently be deleted . Continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      )
        .then(() => {
          let children = this.treeData[0].children;
          let index = -1;
          for (let i = 0; i < children.length; i++) {
            let item = children[i];
            if (item.id == node.id) {
              index = i;
              break;
            }
          }
          if (index != -1) {
            this.treeData[0].children.splice(index, 1);
            this.$refs.tree.setCurrentKey('2');
            this.swichSpace(2, true);
            store.set(node.id + "-id", null);
            store.set("treeData", this.treeData);
          }
          ElMessage({
            type: 'success',
            message: 'Delete completed',
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Delete canceled',
          })
        })
    },
    addSpace() {
      if (this.spaceInput == "") {
        ElMessage({
          showClose: true,
          message: 'space is empty!',
          type: 'warning',
        })
        return;
      }
      const time = new Date().getTime();
      const tempTreeDate = {
        id: time,
        label: this.spaceInput
      }
      this.treeData[0].children.push(tempTreeDate);
      this.spaceInput = "";
      store.set("treeData", this.treeData);
    },
    swichSpace(space, deleted = false) {
      let selectId = space;
      if (!selectId) {
        selectId = this.$refs.tree.getCurrentKey()
      }
      if (selectId == 1) {
        return;
      }
      if (!deleted) {
        this.save(currentSpace);
      }
      editorCanvas.clear();
      currentSpace = selectId;
      this.initeditorCanvas(currentSpace);
      this.TableName = "";
      this.currentTable == null;
      this.Schema = "";
      this.TableComment = "";
      this.tableData = [];

    },
    changeCursor(type) {
      editorCanvas.defaultCursor = type;
    },
    swap(index, type) {
      let temp = null;
      if (type == 1) {
        temp = this.tableData[index];
        this.tableData[index] = this.tableData[index - 1];
        this.tableData[index - 1] = temp;
      } else {
        temp = this.tableData[index];
        this.tableData[index] = this.tableData[index + 1];
        this.tableData[index + 1] = temp;
      }
    },
    addRow() {
      var row = {
        Column: '',
        DataType: 'VARCHAR(20)',
        PK: false,
        NN: false,
        UQ: false,
        AI: false,
        Default: '',
        Comment: ""
      };
      this.tableData.push(row);
      nextTick(() => {
        this.$refs.table.setScrollTop(1000);
      })

    },
    deleteRow(index) {
      this.tableData.splice(index, 1);
    },
    handleInputChange(val, index, col) {
      if (col == 1) {
        this.tableData[index].Column = val;
      } else if (col == 2) {
        this.tableData[index].DataType = val;
      } else if (col == 3) {
        this.tableData[index].PK = val;
        this.tableData[index].NN = val;
      } else if (col == 4) {
        this.tableData[index].NN = val;
      } else if (col == 5) {
        this.tableData[index].UK = val;
      } else if (col == 6) {
        this.tableData[index].AI = val;
        this.tableData[index].NN = val;
      } else if (col == 7) {
        this.tableData[index].Default = val;
      } else if (col == 8) {
        this.tableData[index].Comment = val;
      }
    },
    cancelClick() {
      this.drawer = false;
    },

    saveTable() {
      if (this.TableName == "") {
        ElMessage.error("TableName shouldn't be empty")
        return;
      }
      this.drawer = false;
      let tableText = this.TableName;
      if (this.TableComment != "") {
        tableText = tableText + "\n" + "(" + this.TableComment + ")"
      } else {
        tableText = tableText + "\n" + "(" + tableText + ")"
      }
      // const th = this.currentTable.item(1).item(1);
      // // const tf = this.currentTable.item(0).item(1);
      // th.set({ "text": tableText });
      let tableBody = "";
      let sql = "";
      if (this.tableData.length > 0) {
        sql = "create table " + this.TableName + "(\n";
        if (this.Schema != "") {
          sql = "`create table" + this.Schema + ".`" + "`" + this.TableName + "`(\n"
        }
        const tb = this.currentTable.item(0).item(1);
        let uniqueArr = [];
        for (let i = 0; i < this.tableData.length; i++) {
          const row = this.tableData[i];
          tableBody = tableBody + "  " + row.Column + "  " + row.DataType.toLowerCase() + "  "

          if (row.PK) {
            tableBody = tableBody + " PK "
          }
          if (row.Comment != "") {
            tableBody = tableBody + row.Comment + "  \n";
          } else {
            tableBody = tableBody + "  \n";
          }


          sql = sql + "    " + row.Column + "    " + row.DataType.toLowerCase() + "     ";
          if (row.PK) {
            sql = sql + " primary key ";
          }
          if (row.AI) {
            sql = sql + " auto_increment";
          }
          if (row.NN) {
            sql = sql + " not null ";
          } else {
            sql = sql + " null ";
          }
          if (row.UQ) {
            uniqueArr.push(row);
          }

          if (row.Default != "") {
            if (row.DataType.indexOf("INT") > -1) {
              sql = sql + " default " + row.Default;
            } else if (row.DataType.indexOf("CHAR") > -1 || row.DataType.indexOf("TEXT") > -1) {
              sql = sql + " default " + "'" + row.Default + "'";
            }
          }

          if (row.TableComment != "") {
            sql = sql + " comment " + "'" + row.Comment + "'"
          }
          sql = sql + ",\n"

        }
        if (uniqueArr.length > 0) {
          for (let i = 0; i < uniqueArr.length; i++) {
            const row = uniqueArr[i];
            sql = sql + "constraint " + row.Column + "_UNIQUE unique (" + row.Column + "),\n"
          }
        }
        sql = sql.substring(0, sql.lastIndexOf(','));

        sql = sql + "\n)"
        if (this.TableComment != "") {
          sql = sql + "comment " + "'" + this.TableComment + "';"
        } else {
          sql = sql + ";";
        }
        sql = sql + "\n\n";
        // tb.set({ "text": tableBody });

      }

      let newGroup = this.addTable(this.currentTable.left, this.currentTable.top, { "TName": tableText, "fields": tableBody })
      editorCanvas.remove(editorCanvas.getActiveObject());
      this.currentTable = newGroup;
      this.currentTable.data = { "sql": sql, "Column": this.tableData, "Schema": this.Schema };
      ths.save(null,false);

      // let maxW= th.getScaledWidth();
      // let tfw = tf.getScaledWidth();
      // if(maxW<tfw){
      //   maxW = tfw;
      // }
      // this.currentTable.item(1).set("width", maxW+10);
      // this.currentTable.item(0).set("width", maxW+10);
      //this.adjustTableSize(this.currentTable);
      // this.adjustTableSize(this.currentTable);
      // editorCanvas.renderAll();

      // this.currentTable
    },

    save(space, show) {
      if (!space) {
        space = this.$refs.tree.getCurrentKey();
      }
      var json = editorCanvas.toJSON(["id", "name", "data", "sql"]);
      store.set(space + "-id", json);
      store.set("treeData", this.treeData);
      config.cw = editorCanvas.width;
      config.ch = editorCanvas.height;
      store.set("canvasConfig",config);
      if (show) {
        ElMessage({
          message: 'saved successfully',
          type: 'success',
        })
      }
    },



    drawLine() {
      var line = new fabric.Line([350, 10, 220, 150], {
        stroke: 'black',

        angle: 135

      });
      editorCanvas.add(line);
    },

    addGroup() {
      //绘制圆形
      var circle = new fabric.Circle({
        radius: 100,
        fill: '#d70202',
        originX: 'center', //调整中心点的X轴坐标
        originY: 'center', //调整中心点的Y轴坐标
      });
      //绘制文本
      var text = new fabric.Text('公众号:霸道的程序猿', {
        fontSize: 20,
        originX: 'center',
        originY: 'center',
      })
      //进行组合
      var group = new fabric.Group([circle, text], {
        left: 350,
        top: 200,
      })
      editorCanvas.add(group);
    },
    changeDrawType(type) {
      drawType = type;
      if (type == "drawing") {
        editorCanvas.isDrawingMode = true;
      }


      if (type == "drawing") {
        this.changeToolsValue(this.tools.pencilPath);
      } else if (type == "table") {
        this.changeToolsValue(this.tools.tablePath);
      } else if (type == "arrow") {
        this.changeToolsValue(this.tools.arrowPath);
      } else if (type == "text") {
        this.changeToolsValue(this.tools.textPath);
      }
    },
    changeToolsValue(nowValue) {
      for (var i in this.tools) {
        if (this.tools[i] == nowValue && nowValue.indexOf("blue.png") == -1) {
          this.tools[i] = this.tools[i].replace(".png", "-blue.png")
        } else if (this.tools[i] == nowValue && nowValue.indexOf("blue.png") != -1) {
          this.tools[i] = this.tools[i].replace("-blue.png", ".png")
          drawType = null;
        } else {
          this.tools[i] = this.tools[i].replace("-blue.png", ".png");
        }
      }
    },
    addTable(left, top, tableData) {
      let data = { "TName": "tableName_demo\n(dblclick on me)", "fields": "" };
      if (tableData) {
        data = tableData;
      }
      const canvasObject = new fabric.Rect({
        width: config.TWidth,
        height: 100,
        fill: config.TFColor,
        originX: 'left', //调整中心点的X轴坐标
        originY: 'top', //调整中心点的Y轴坐标
        rx: config.rx,
        ry: config.ry,
        strokeWidth: 1,
        stroke: 'gray',


      });
      const innerRect = new fabric.Rect({
        width: config.TWidth,
        height: 50,
        fill: config.THColor,
        originX: 'left', //调整中心点的X轴坐标
        originY: 'top', //调整中心点的Y轴坐标
        rx: config.rx,
        ry: config.ry,

      });
      var text = new fabric.Textbox(data.TName, {
        fontSize: 20,
        textAlign: 'center',
        width: config.TWidth

      })

      var text2 = new fabric.Text(data.fields, {
        fontSize: 15,
        textAlign: 'left',
        width: config.TWidth,
        top: 55,
      })
      var group0 = new fabric.Group([innerRect, text], {

      });
      var group2 = new fabric.Group([canvasObject, text2], {

      });
      var group = new fabric.Group([group2, group0], {
        left: left,
        top: top,
      })


      group.set({ "name": "table", id: new Date().getTime(), "data": { "Column": [], "Schema": "", "Index": [] } });


      this.addTableEvent(group);
      this.adjustTableSize(group);
      editorCanvas.add(group);
      return group;

    },

    adjustTableSize(group) {
      var tableHeadRect = group.item(1).item(0);
      var tableHeadTextRect = group.item(1).item(1);

      var tableBodyRect = group.item(0).item(0);
      var tableBodyTextRect = group.item(0).item(1);

      const ch = tableBodyRect.getScaledHeight();
      const th = tableBodyTextRect.getScaledHeight();

      if (ch - 50 < th) {
        tableBodyRect.set("height", th + tableHeadRect.getScaledHeight());
        // group.set("height", th + 50);
        //group.set("height",th + tableHeadRect.getScaledHeight());
        // innerRect.set("width", canvasObject.getScaledWidth());
      }
      if (th + 50 < ch && tableBodyTextRect.text != "") {
        tableBodyRect.set("height", th + 50);
        group.set("height", th + 50);
      }
      const cw = tableBodyRect.getScaledWidth();
      const tw = tableBodyTextRect.getScaledWidth();
      if (tw > cw) {
        tableBodyRect.set("width", tw);
        tableHeadRect.set("width", tw);
        tableHeadTextRect.set("width", tw);
      }

    },
    addText(left, top) {
      const canvasObject = new fabric.IText('这里是文字',
        {
          width: 300,
          fontSize: 14,
          fontFamily: 'Comic Sans',
          left: left,
          top: top,
          fill: 'black',
          splitByGrapheme: true, // 自动换行
        })
      editorCanvas.add(canvasObject);

    },
    // 初始化模板编辑画布
    initeditorCanvas(space) {
      let that = this;
      const json = store.get(space + "-id");
      if (editorCanvas != null) {
        if (json) {
          editorCanvas.setBackgroundColor({
            source: "images/canvas_bg.jpg",
            repeat: 'repeat',
          }, editorCanvas.renderAll.bind(editorCanvas));
          editorCanvas.loadFromJSON(json, editorCanvas.renderAll.bind(editorCanvas));
          return;
        }
      } else {
        editorCanvas = new fabric.Canvas("canvas");
        editorCanvas.setBackgroundColor({
          source: "images/canvas_bg.jpg",
          repeat: 'repeat',
        }, editorCanvas.renderAll.bind(editorCanvas));
      }
      if(json){
        editorCanvas.loadFromJSON(json, function(){
          editorCanvas.renderAll.bind(editorCanvas);
          that.addGroupKeyDown();
        });
      }else{
        this.addGroupKeyDown();
      }
      if(config.cw){
        this.setCanvasWH(config.cw,config.ch);
      }
      this.canvasWH = {"w":config.cw,"h":config.ch}
    },
    addGroupKeyDown(){
      var canvasWrapper = document.getElementById('canvasWrap');
      canvasWrapper.tabIndex = 1000;

      nextTick(() => {
        canvasWrapper.addEventListener("keydown", this.keyDownEvent, false);
        this.addCanvasEvent();
        const tables = editorCanvas.getObjects("group");
        if (tables.length > 0) {
          for (let i = 0; i < tables.length; i++) {
            if (tables[i].name == "table") {
              this.addTableEvent(tables[i]);
            }
          }
        }
      })
    },
    addCanvasEvent() {
      let that = this;
      editorCanvas.on("mouse:up", function (options) {
        // var xy = transformMouse(options.e.offsetX, options.e.offsetY);
        // mouseTo.x = options.e.offsetY;
        // mouseTo.y = xy.y;

        if (drawType == "drawing") {
          that.tools.pencilPath = "./images/pencil.png";
        } else if (drawType == "table") {
          that.tools.tablePath = "./images/table.png";
        } else if (drawType == "arrow") {
          that.tools.arrowPath = "./images/arrow.png";
        } else if (drawType == "text") {
          that.tools.textPath = "./images/text.png";
        }

        drawType = null;
        editorCanvas.isDrawingMode = false;
        moveCount = 1;
        drawingObject = null;
        editorCanvas.defaultCursor = "default";
        mouseFrom = {};
      });
      editorCanvas.on("mouse:move", function (options) {

        if (drawType == null) {

          return;
        }
        moveCount++;
        //减少绘制频率
        if (moveCount % 2) {
          return;
        }
        // var xy =  transformMouse(options.e.offsetX, options.e.offsetY);
        if (drawingObject) {
          editorCanvas.remove(drawingObject);
        }
        if (drawType == "arrow" && mouseFrom.x) {

          mouseTo.x = options.e.offsetX;
          mouseTo.y = options.e.offsetY;
          const arrowObject = new fabric.Path(that.drawArrow(mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y, 10, 10), {
            stroke: "black",
            fill: "rgba(255,255,255,0)",
            strokeWidth: 1
          });
          editorCanvas.add(arrowObject); //.setActiveObject(canvasObject)

          // canvasObject.index = getCanvasObjectIndex();
          drawingObject = arrowObject;
        } else if (drawType == "table" || drawType == "arrow" || drawType == "drawing") {
          editorCanvas.defaultCursor = "crosshair"
        } else if (drawType == "text") {
          editorCanvas.defaultCursor = "text"
        }
      });

      editorCanvas.on("mouse:down", function (options) {
        //var xy = transformMouse(options.e.offsetX, options.e.offsetY);

        //doDrawing = true;
        // if(that.drawType!=null){
        //   editorCanvas.set();
        // }
        if (drawType == "table") {
          that.addTable(options.e.offsetX, options.e.offsetY);
        } else if (drawType == "arrow" || drawType == "line") {
          mouseFrom.x = options.e.offsetX;
          mouseFrom.y = options.e.offsetY;
        } else if (drawType == "text") {
          that.addText(options.e.offsetX, options.e.offsetY);
        }
      });
    },
    drawArrow(fromX, fromY, toX, toY, theta, headlen) {
      theta = typeof theta != "undefined" ? theta : 30;
      headlen = typeof theta != "undefined" ? headlen : 10;
      // 计算各角度和对应的P2,P3坐标
      var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);
      var arrowX = fromX - topX,
        arrowY = fromY - topY;
      var path = " M " + fromX + " " + fromY;
      path += " L " + toX + " " + toY;
      arrowX = toX + topX;
      arrowY = toY + topY;
      path += " M " + arrowX + " " + arrowY;
      path += " L " + toX + " " + toY;
      arrowX = toX + botX;
      arrowY = toY + botY;
      path += " L " + arrowX + " " + arrowY;
      return path;
    },
    addTableEvent(obj) {
      obj.on("mousedblclick", opt => {
        this.TableName = "";
        this.TableComment = "";
        this.drawer = true;
        this.currentTable = opt.target;
        const tableArr = this.currentTable.item(1).item(1).text.split("\n");
        if (tableArr[0].indexOf("tableName") == -1) {
          this.TableName = tableArr[0];
        }
        if (tableArr[1].indexOf("dblclick") == -1) {
          this.TableComment = tableArr[1].replace(/\(|\)/g, "");
        }
        this.tableData = this.currentTable.data.Column;
        this.Schema = this.currentTable.data.Schema;
      })
    },
    keyDownEvent(e) {
      if (e.keyCode == 8 || e.keyCode == 46) {
        const aObs = editorCanvas.getActiveObjects();
        if (aObs.length > 0) {
          editorCanvas.remove.apply(editorCanvas, aObs);
          editorCanvas.renderAll();
        }

      } else if ((e.ctrlKey || e.metaKey) && e.keyCode == 67) {
        this.clonecopy();
      }else if ((e.ctrlKey || e.metaKey) && e.keyCode == 83) {
        this.save(null,true);
      }

    },
    zoom(isBig) {
      if (isBig) {
        factor = factor + 0.1;
      } else {
        factor = factor - 0.1;
        if (factor < 0.1) {
          factor = 0.1;
        }
      }
      editorCanvas.setZoom(factor);
      editorCanvas.renderAll();
      // let cWidth = editorCanvas.width;
      // editorCanvas.setWidth(cWidth * factor);
      // editorCanvas.setHeight(cWidth * factor);
      // if (editorCanvas.backgroundImage) {
      //   var bi = editorCanvas.backgroundImage;
      //   bi.width = bi.width * factor;
      //   bi.height = bi.height * factor;
      // }
      // var objects = editorCanvas.getObjects();
      // for (var i in objects) {
      //   var scaleX = objects[i].scaleX;
      //   var scaleY = objects[i].scaleY;
      //   var left = objects[i].left;
      //   var top = objects[i].top;

      //   var tempScaleX = scaleX * factor;
      //   var tempScaleY = scaleY * factor;
      //   var tempLeft = left * factor;
      //   var tempTop = top * factor;

      //   objects[i].scaleX = tempScaleX;
      //   objects[i].scaleY = tempScaleY;
      //   objects[i].left = tempLeft;
      //   objects[i].top = tempTop;

      //   objects[i].setCoords();
      // }
      // editorCanvas.renderAll();
      // editorCanvas.calcOffset();
    }
  },
}
</script>

<style scoped>
.row-flex {
  display: flex;
  flex-direction: row;
}

.col-flex {
  display: flex;
  flex-direction: column;
}

.canvasDiv {
  position: relative;
  /* background: url(./assets/images/canvas_bg.jpg) repeat; */
  width: 100%;
  height: 100vh;
  overflow: auto;
}

.tool-img {
  width: 3.5rem;
  height: 3.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
  cursor: pointer;
}
</style>
