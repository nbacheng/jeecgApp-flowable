## 1.0.2（2022-11-03）
更新返回值说明，由原来只返回选中数据的key改为返回选中数据数组
#### 参数说明

|     属性名      |类型|   默认值   | 说明                                   |
|:------------:|---|:-------:|--------------------------------------|
|    range     |Array|    -    | 本地渲染数据                               |
|    idKey     |String|   id    | 指定 Object 中 key 的值作为单条数据的唯一id        |
|   nameKey    |String|  name   | 指定 Object 中 key 的值作为选择器显示的内容         |
|    allKey    |String|  value  | 指定 Object 中 其他需要返回的内容                |
|    title     |String|    -    | 选择器的名称默认为空                           |
|  titleColor  |String| #757575 | 标题的颜色                                |
| confirmColor |String| #007aff | 确定按钮及选择框的颜色                          |
| cancelColor  |String| #757575 | 取消按钮的颜色                              |
| currentIcon  |String|  默认图标   | 折叠时的图标                               |
| defaultIcon  |String|  默认图标   | 打开之后的图标                              |
| lastIcon  |String|   默认无   | 没有子集时的图标                             |
|   multiple   |Boolean|  true   | 是否可以多选（true:多选、false:单选）             |
|   cascade   |Boolean|  false  | 在多选时，选中父级，子集是否跟随选中（true:级联、false:不级联） |
|   selectParent   |Boolean|  true   | 父级是否可选（true:可选、false:不可选）            |
|   foldAll   |Boolean|  false  | 父级折叠时是否折叠所有已经打开的子集（true:折叠、false:不折叠） |
| @cancel  |Handler|    -    | 点击取消按钮时的回调方法                         |
| @confirm  |Handler|    -    | 点击确定按钮时的回调方法                         |

#### 返回值说明
```vue
	treeConfirm(e) {
        console.log("你点击了确定")
        console.log(e)
		/**
		 * e==>
		 * [
		 *	 {id: "100", name: "测试100", value: "冗余值"}
		 *	 {id: "110", name: "测试110", value: "冗余值"}
		 *	 {id: "111", name: "测试111", value: "冗余值"}
		 * ]
		 * e为选中的数据数组
		 * e中的对象中有id(idKey指定的字段值)、name(nameKey指定的字段)、value(allKey指定的字段)
		 */
    },

```

#### 代码使用示例
```vue
<template>
    <view>
        <button @click="showTree" type="primary" style="width: 50%; margin-top: 20px;">
            打开树形选择器
        </button>
        <peng-tree
                ref="pengTree"
                :range="range"
                idKey="id"
                nameKey="name"
                allKey="value"
                :multiple="false"
                :cascade="false"
                :selectParent="false"
                :foldAll="false"
                confirmColor="#007aff"
                cancelColor="#757575"
                title="标题"
                titleColor="#757575"
                @cancel="treeCancel"
                @confirm="treeConfirm"
        >
        </peng-tree>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                range: [{
                    id: "100",
                    name: "测试100",
                    value: "冗余值",
                    children: [{
                        id: "110",
                        name: "测试110",
                        value: "冗余值",
                        children: [{
                            id: "111",
                            name: "测试111",
                            value: "冗余值",
                        }]
                    }]
                },
                    {
                        id: "200",
                        name: "测试200",
                        value: "冗余值",
                        children: [{
                            id: "220",
                            name: "测试220",
                            value: "冗余值",
                            children: [{
                                id: "222",
                                name: "测试222",
                                value: "冗余值",
                            }]
                        }]
                    },
                    {
                        id: "300",
                        name: "测试300",
                        value: "冗余值"
                    }
                ]
            }
        },
        methods: {
            showTree() {
                //打开选择器
                this.$refs.pengTree._show();
                //关闭选择器
                //this.$refs.pengTree._hide();
            },
            treeCancel(e) {
                console.log("你点击了取消")
                console.log(e)
            },
            treeConfirm(e) {
                console.log("你点击了确定")
                console.log(e)
            },
        }
    }
</script>

```
