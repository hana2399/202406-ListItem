## 引入 Bootstrap：

在文件的頂部引入 Bootstrap 的 CSS 文件來使用 Bootstrap 的樣式和工具。
容器和標題：

使用 container 和 my-4 類來設置容器和外邊距。
導入和導出部分：

使用 d-flex, flex-column, flex-md-row, justify-content-between, align-items-center, mb-4 類來設置布局，使其在小螢幕下垂直排列，在中等及以上螢幕水平排列。
表格部分：

使用 table-responsive 來讓表格在小螢幕上可橫向滾動。
使用 table, table-bordered 類來設置表格的樣式。
新增/編輯項目部分：

使用 form-select 和 form-control 來設置表單控件的樣式。
使用 d-flex, flex-column, flex-md-row, flex-wrap 類來設置布局，使其在小螢幕下垂直排列，在中等及以上螢幕水平排列。
這些改動將應用 Bootstrap 的響應式設計，使得應用在不同螢幕尺寸下有良好的顯示效果。

## RWD 說明
在這個範例中，主要使用了 Tailwind CSS 的一些 RWD 工具來實現響應式設計。這裡是一些主要的修改說明：

flex flex-col md:flex-row：

在多個地方使用了這個類，意思是讓元素在小螢幕時排成一列 (flex-col)，在中等及以上螢幕尺寸時排成一行 (md:flex-row)。
mb-2 md:mb-0 md:mr-2：

這些類用於設置在不同螢幕尺寸下的邊距。小螢幕下每個元素的底部有邊距 (mb-2)，中等及以上螢幕尺寸時移除底部邊距 (md:mb-0) 並增加右側邊距 (md:mr-2)，這樣元素可以排成一行。
overflow-x-auto：

當表格內容過多時，在小螢幕上允許橫向滾動 (overflow-x-auto)，確保內容不會溢出視窗。
這些改動使得網頁在不同螢幕尺寸下都能夠有良好的顯示效果。