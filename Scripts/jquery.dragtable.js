///<reference path="../typings/jquery/jquery.d.ts"/>
var Anterec;
var callBackMethod;
(function (Anterec) {
    var JsDragTable = (function () {
        function JsDragTable(target) {
            this.offsetX = 5;
            this.offsetY = 5;
            this.container = target;
            this.rebind();
        }
        function onDragEnd() {
            $("#cepFavTblGrid #tblHead th").removeClass("nohover");
            $('.cepSearchWindow').off("mousemove touchmove");
            $('.cepSearchWindow').off("mouseup");
            $(".jsdragtable-contents").remove();
            $('.JCLRgrips').css("display", "block");
           
        }
        function documentClick() {            
            document.removeEventListener("click", documentClick);
            onDragEnd();
        }
        JsDragTable.prototype.rebind = function () {
            var _this = this;
            $(this.container).find("th").each(function (headerIndex, header) {
                $(header).off("mousedown touchstart");
                $(header).off("mouseup touchend");
                $(header).on("mousedown touchstart", function (event) {
                    _this.selectColumn($(header), event);
                });
                $(header).on("mouseup touchend", function (event) {                    
                    _this.dropColumn($(header), event);
                });   
            });          
            $(this.container).on("mouseup touchend", function () {
                _this.cancelColumn();
            });
        };
        var topMargin = 0;
        JsDragTable.prototype.selectColumn = function (header, event) {           
            var _this = this;            
            localStorage.removeItem('isColumnMoved')
            topMargin = 0;
            var headerText = header[0].outerHTML;
            event.preventDefault();
            var userEvent = new UserEvent(event);
            this.selectedHeader = header;
            var sourceIndex = this.selectedHeader.index() + 1;
            var cells = [];

            $(this.container).find("tr td:nth-child(" + sourceIndex + ")").each(function (cellIndex, cell) {
                cells[cells.length] = cell;
            });
           
            this.draggableContainer = $("<div/>");
            this.draggableContainer.addClass("jsdragtable-contents");
            this.draggableContainer.css({ position: "absolute", left: userEvent.event.pageX + this.offsetX, top: userEvent.event.pageY + this.offsetY });

            //var dragtable = this.createDraggableTable(header);
            //$(cells).each(function (cellindex, cell) {
            //    var tr = $("<tr/>");
            //    var td = $("<td/>");
            //    $(td).html($(cells[cellindex]).html());
            //    $(tr).append(td);
            //    $(dragtable).find("tbody").append(tr);
            //});            
            //this.draggableContainer.append(dragtable);          
            this.draggableContainer.append(header[0].innerHTML);
            $("#cepFavTblGrid #tblHead th").addClass("nohover");
            $(".my-grid-table").append(this.draggableContainer);
            $('.cepSearchWindow').on("mousemove touchmove", function (event) {
                _this.moveColumn($(header), event);
            });
            document.addEventListener("click", documentClick, false);
            $('.cepSearchWindow').on("mouseup", function (event) {                
                _this.cancelColumn();
            });
            $(".jsdragtable-contents").on("mouseup touchend", function () {
                _this.cancelColumn();
            });
        };
        
        JsDragTable.prototype.moveColumn = function (header, event) {
            localStorage.isColumnMoved = true;
            $(this.container).find("th").css("cursor", "pointer");
            $('.JCLRgrips').css("display", "none");           
            //var leftPos= $('.cepFavDataDiv').scrollLeft();            
            //$(".cepFavDataDiv").animate({
            //    scrollLeft: leftPos + 100
            //});
            
            event.preventDefault();
            if (this.selectedHeader !== null) {               
                var userEvent = new UserEvent(event);
                var x = 0;
                var offset=$(".my-grid-table").offset();
                x = (userEvent.event.pageX - offset.left)+10;
                if (topMargin == 0) {
                    topMargin = userEvent.event.pageY - offset.top;
                    this.draggableContainer.css({ left: x, top: topMargin });                                 
                    $('.jsdragtable-contents').css("display", "block");
                    var minWidth = ($(".jsdragtable-contents span.headSpan").attr('wdth'));
                    $(".jsdragtable-contents span.headSpan").css("width", minWidth);
                }
                else {
                    this.draggableContainer.css({ left: x, top: topMargin });
                }
               
               
            }
        };

        JsDragTable.prototype.dropColumn = function (header, event) {            
            if (localStorage.isColumnMoved) {
                var _this = this;
                event.preventDefault();
                var sourceIndex = this.selectedHeader.index() + 1;
                var targetIndex = $(event.target).index() + 1;
                var tableColumns = $(this.container).find("th").length;

                var userEvent = new UserEvent(event);
                if (userEvent.isTouchEvent) {
                    header = $(document.elementFromPoint(userEvent.event.clientX, userEvent.event.clientY));
                    targetIndex = $(header).prevAll().length + 1;
                }                
                if (sourceIndex !== targetIndex) {
                    var cells = [];
                    $(this.container).find("tr td:nth-child(" + sourceIndex + ")").each(function (cellIndex, cell) {
                        cells[cells.length] = cell;
                        $(cell).remove();
                        $(_this.selectedHeader).remove();
                    });

                    if (targetIndex >= tableColumns) {
                        targetIndex = tableColumns - 1;
                        this.insertCells(cells, targetIndex, function (cell, element) {
                            $(cell).after(element);
                        });
                    } else {
                        this.insertCells(cells, targetIndex, function (cell, element) {
                            $(cell).before(element);
                        });
                    }
                    onDragEnd();
                    $(this.container).off("mousemove touchmove");
                    this.draggableContainer = null;
                    this.selectedHeader = null;
                    this.rebind();
                    callBackMethod.call();
                }
            }
        };

        JsDragTable.prototype.cancelColumn = function () {            
            onDragEnd();
            $(this.container).off("mousemove touchmove");           
            this.draggableContainer = null;
            this.selectedHeader = null;           
        };

        JsDragTable.prototype.createDraggableTable = function (header) {
            var table = $("<table/>");
            var thead = $("<thead/>");
            var tbody = $("<tbody/>");
            var tr = $("<tr/>");
            var th = $("<th/>");
            $(table).addClass($(this.container).attr("class"));
            $(table).width($(header).width());
            $(th).html($(header).html());
            $(tr).append(th);
            $(thead).append(tr);
            $(table).append(thead);
            $(table).append(tbody);
            return table;
        };

        JsDragTable.prototype.insertCells = function (cells, columnIndex, callback) {
            var _this = this;
            $(this.container).find("tr td:nth-child(" + columnIndex + ")").each(function (cellIndex, cell) {
                callback(cell, $(cells[cellIndex]));
            });
            $(this.container).find("th:nth-child(" + columnIndex + ")").each(function (cellIndex, cell) {
                callback(cell, $(_this.selectedHeader));
            });
        };
        return JsDragTable;
    })();
    Anterec.JsDragTable = JsDragTable;

    var UserEvent = (function () {
        function UserEvent(event) {
            this.event = event;
            if (event.originalEvent && event.originalEvent.touches && event.originalEvent.changedTouches) {
                this.event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                this.isTouchEvent = true;
            }
        }
        return UserEvent;
    })();
})(Anterec || (Anterec = {}));
jQuery.fn.extend({
    jsdragtable: function (afterColumnDrg) {
        callBackMethod = afterColumnDrg;
        return new Anterec.JsDragTable(this);
    }
});
