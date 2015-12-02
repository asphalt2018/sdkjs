"use strict";

var MATH_MC_JC = MCJC_CENTER;

function CMathMatrixColumnPr()
{
    this.count = 1;
    this.mcJc  = MCJC_CENTER;
}

CMathMatrixColumnPr.prototype.Set_FromObject = function(Obj)
{
    if (undefined !== Obj.count && null !== Obj.count)
        this.count = Obj.count;
    else
        this.count = 1;

    if (MCJC_LEFT === Obj.mcJc || MCJC_RIGHT === Obj.mcJc || MCJC_CENTER === Obj.mcJc)
        this.mcJc = Obj.mcJc;
    else
        this.mcJc = MCJC_CENTER;
};

CMathMatrixColumnPr.prototype.Copy = function()
{
    var NewPr = new CMathMatrixColumnPr();

    NewPr.count = this.count;
    NewPr.mcJc  = this.mcJc;

    return NewPr;
};

CMathMatrixColumnPr.prototype.Write_ToBinary = function(Writer)
{
    // Long : count
    // Long : mcJc

    Writer.WriteLong(this.count);
    Writer.WriteLong(this.mcJc);
};

CMathMatrixColumnPr.prototype.Read_FromBinary = function(Reader)
{
    // Long : count
    // Long : mcJc

    this.count = Reader.GetLong();
    this.mcJc  = Reader.GetLong();
};

function CMathMatrixPr()
{
    this.row     = 1;

    this.cGp     = 0;
    this.cGpRule = 0;
    this.cSp     = 0;

    this.rSp     = 0;
    this.rSpRule = 0;

    this.mcs     = [];
    this.baseJc  = BASEJC_CENTER;
    this.plcHide = false;
}
CMathMatrixPr.prototype.Set_FromObject = function(Obj)
{
    if (undefined !== Obj.row && null !== Obj.row)
        this.row = Obj.row;

    if (undefined !== Obj.cGp && null !== Obj.cGp)
        this.cGp = Obj.cGp;

    if (undefined !== Obj.cGpRule && null !== Obj.cGpRule)
        this.cGpRule = Obj.cGpRule;

    if (undefined !== Obj.cSp && null !== Obj.cSp)
        this.cSp = Obj.cSp;

    if (undefined !== Obj.rSpRule && null !== Obj.rSpRule)
        this.rSpRule = Obj.rSpRule;

    if (undefined !== Obj.rSp && null !== Obj.rSp)
        this.rSp = Obj.rSp;

    if(true === Obj.plcHide || 1 === Obj.plcHide)
        this.plcHide = true;
    else
        this.plcHide = false;

    if(BASEJC_CENTER === Obj.baseJc || BASEJC_TOP === Obj.baseJc || BASEJC_BOTTOM === Obj.baseJc)
        this.baseJc = Obj.baseJc;

    var nColumnsCount = 0;
    if (undefined !== Obj.mcs.length)
    {
        var nMcsCount = Obj.mcs.length;

        if (0 !== nMcsCount)
        {
            this.mcs.length = nMcsCount;
            for (var nMcsIndex = 0; nMcsIndex < nMcsCount; nMcsIndex++)
            {
                this.mcs[nMcsIndex] = new CMathMatrixColumnPr();
                this.mcs[nMcsIndex].Set_FromObject(Obj.mcs[nMcsIndex]);
                nColumnsCount += this.mcs[nMcsIndex].count;
            }
        }
        else if (undefined !== Obj.column)
            nColumnsCount = Obj.column;
    }

    return nColumnsCount;
};
CMathMatrixPr.prototype.Copy = function()
{
    var NewPr = new CMathMatrixPr();

    NewPr.row     = this.row    ;
    NewPr.cGp     = this.cGp    ;
    NewPr.cGpRule = this.cGpRule;
    NewPr.cSp     = this.cSp    ;
    NewPr.rSp     = this.rSp    ;
    NewPr.rSpRule = this.rSpRule;
    NewPr.baseJc  = this.baseJc ;
    NewPr.plcHide = this.plcHide;

    var nCount = this.mcs.length;
    for (var nMcsIndex = 0; nMcsIndex < nCount; nMcsIndex++)
    {
        NewPr.mcs[nMcsIndex] = this.mcs[nMcsIndex].Copy();
    }

    return NewPr;
};
CMathMatrixPr.prototype.Get_ColumnsCount = function()
{
    var nColumnsCount = 0;
    for (var nMcsIndex = 0, nMcsCount = this.mcs.length; nMcsIndex < nMcsCount; nMcsIndex++)
    {
        nColumnsCount += this.mcs[nMcsIndex].count;
    }
    return nColumnsCount;
};
CMathMatrixPr.prototype.Write_ToBinary = function(Writer)
{
    // Long  : row
    // Long  : cGp
    // Long  : cGpRule
    // Long  : rSp
    // Long  : rSpRule
    // Long  : baseJc
    // Bool  : plcHide
    // Long  : count of mcs
    // Array : mcs (CMathMatrixColumnPr)

    Writer.WriteLong(this.row);
    Writer.WriteLong(this.cGp);
    Writer.WriteLong(this.cGpRule);
    Writer.WriteLong(this.rSp);
    Writer.WriteLong(this.rSpRule);
    Writer.WriteLong(this.baseJc);
    Writer.WriteBool(this.plcHide);

    var nMcsCount = this.mcs.length;
    Writer.WriteLong(nMcsCount);
    for (var nIndex = 0; nIndex < nMcsCount; nIndex++)
    {
        this.mcs[nIndex].Write_ToBinary(Writer);
    }
};
CMathMatrixPr.prototype.Read_FromBinary = function(Reader)
{
    // Long  : row
    // Long  : cGp
    // Long  : cGpRule
    // Long  : rSp
    // Long  : rSpRule
    // Long  : baseJc
    // Bool  : plcHide
    // Long  : count of mcs
    // Array : mcs (CMColumnsPr)

    this.row = Reader.GetLong();
    this.cGp = Reader.GetLong();
    this.cGpRule = Reader.GetLong();
    this.rSp     = Reader.GetLong();
    this.rSpRule = Reader.GetLong();
    this.baseJc  = Reader.GetLong();
    this.plcHide = Reader.GetBool();

    var nMcsCount = Reader.GetLong();
    this.mcs.length = nMcsCount;
    for (var nIndex = 0; nIndex < nMcsCount; nIndex++)
    {
        this.mcs[nIndex] = new CMathMatrixColumnPr();
        this.mcs[nIndex].Read_FromBinary(Reader);
    }
};

/**
 *
 * @constructor
 * @extends {CMathBase}
 */
function CMatrixBase()
{
    CMatrixBase.superclass.constructor.call(this);
}
Asc.extendClass(CMatrixBase, CMathBase);
CMatrixBase.prototype.recalculateSize = function(oMeasure, RPI)
{
    if(this.RecalcInfo.bProps)
    {
        if(this.nRow > 1)
            this.setRuleGap(this.spaceRow, this.Pr.rSpRule, this.Pr.rSp);

        if(this.nCol > 1)
        {
            this.setRuleGap(this.spaceColumn, this.Pr.cGpRule, this.Pr.cGp, this.Pr.cSp);
        }

        if(this.kind == MATH_MATRIX)
        {
            // выставим выравнивание для столбцов
            if(this.Pr.mcs !== undefined)
            {
                var lng = this.Pr.mcs.length;
                var col = 0;

                this.alignment.wdt.length = 0;

                for(var j = 0; j < lng; j++)
                {
                    var mc = this.Pr.mcs[j],
                        count = mc.count;

                    for(var i = 0; i < count; i++)
                    {
                        this.alignment.wdt[col] = mc.mcJc;
                        col++;
                    }
                }
            }


            if(this.Pr.plcHide)
                this.hidePlaceholder(true);
        }

        this.RecalcInfo.bProps = false;
    }

    var FontSize = this.Get_TxtPrControlLetter().FontSize;
    var metrics = this.getMetrics();

    if(this.nCol > 1)
    {
        var gapsCol = this.getLineGap(this.spaceColumn, FontSize);

        for(var i = 0; i < this.nCol - 1; i++)
            this.gaps.column[i] = gapsCol;
    }

    this.gaps.column[this.nCol - 1] = 0;

    if(this.nRow > 1)
    {
        var intervalRow = this.getRowSpace(this.spaceRow, FontSize);

        var divCenter = 0;

        var plH = 0.2743827160493827*FontSize;
        var minGp = this.spaceRow.minGap*FontSize*g_dKoef_pt_to_mm;
        minGp -= plH;

        for(var j = 0; j < this.nRow - 1; j++)
        {
            divCenter = intervalRow - (metrics.descents[j] + metrics.ascents[j + 1]);
            this.gaps.row[j] = minGp > divCenter ? minGp : divCenter;
        }
    }

    this.gaps.row[this.nRow - 1] = 0;


    var height = 0, width = 0;

    for(var i = 0; i < this.nCol; i++)
        width +=  this.gaps.column[i] + metrics.widths[i];

    for(var j = 0; j < this.nRow; j++)
        height += this.gaps.row[j] + metrics.ascents[j] + metrics.descents[j];

    var ascent = 0;

    if(this.Pr.baseJc == BASEJC_TOP)
    {
        for(var j = 0; j < this.nCol; j++)
            ascent = this.elements[0][j].size.ascent > ascent ? this.elements[0][j].size.ascent : ascent;
    }
    else if(this.Pr.baseJc == BASEJC_BOTTOM)
    {
        var descent = 0,
            currDsc;
        for(var j = 0; j < this.nCol; j++)
        {
            currDsc = this.elements[this.nRow -1][j].size.height - this.elements[this.nRow -1][j].size.ascent;
            descent = currDsc > descent ? currDsc : descent;

            ascent = height - descent;
        }
    }
    else /*this.Pr.baseJc == 0*/
        ascent = this.getAscent(oMeasure, height);


    width += this.GapLeft + this.GapRight;

    this.size.height = height;
    this.size.width  = width;
    this.size.ascent = ascent;
};
CMatrixBase.prototype.baseJustification = function(type)
{
    this.Pr.baseJc = type;
};
CMatrixBase.prototype.setDefaultSpace = function()
{
    this.spaceRow =
    {
        rule: 0,
        gap: 0,
        minGap: 13/12    // em
        // 780 /20 (pt) for font 36 pt
        // minGap: 0
    };
    this.spaceColumn =
    {
        rule: 0,
        gap: 0,
        minGap: 0       // minGap / 20 pt
    };

    this.gaps =
    {
        row: [],
        column: []
    };
};
CMatrixBase.prototype.setRuleGap = function(oSpace, rule, gap, minGap)
{
    var bInt  =  rule == rule - 0 && rule == rule^0,
        bRule =  rule >= 0 && rule <= 4;

    if(bInt && bRule)
        oSpace.rule = rule;
    else
        oSpace.rule = 0;

    if(gap == gap - 0 && gap == gap^0)
        oSpace.gap = gap;
    else
        oSpace.gap = 0;

    if(minGap == minGap - 0 && minGap == minGap^0)
        oSpace.minGap = minGap;
};
CMatrixBase.prototype.getLineGap = function(spaceColumn, FontSize)
{
    var spLine;

    if(spaceColumn.rule == 0)
        spLine = 1;             //em
    else if(spaceColumn.rule == 1)
        spLine = 1.5;           //em
    else if(spaceColumn.rule == 2)
        spLine = 2;             //em
    else if(spaceColumn.rule == 3)
        spLine = spaceColumn.gap/20;  //pt
    else if(spaceColumn.rule == 4)
        spLine = spaceColumn.gap/2;   //em
    else
        spLine = 1;

    var lineGap;

    if(spaceColumn.rule == 3)
        lineGap = spLine*g_dKoef_pt_to_mm;                           //pt
    else
        lineGap = spLine*FontSize*g_dKoef_pt_to_mm;           //em

    var wPlh = 0.3241834852430555*FontSize;

    var min = spaceColumn.minGap / 20 * g_dKoef_pt_to_mm - wPlh;
    lineGap = Math.max(lineGap, min);
    //lineGap += this.params.font.metrics.Placeholder.Height; // для случая, когда gapRow - (аскент + дескент) > minGap, вычитаем из gap строки, а здесь прибавляем стандартный metrics.Height

    return lineGap;
};
CMatrixBase.prototype.getRowSpace = function(spaceRow, FontSize)
{
    var spLine;

    if(spaceRow.rule == 0)
        spLine = 7/6;                 //em
    else if(spaceRow.rule == 1)
        spLine = 7/6 *1.5;            //em
    else if(spaceRow.rule == 2)
        spLine = 7/6 *2;              //em
    else if(spaceRow.rule == 3)
        spLine = spaceRow.gap/20;         //pt
    else if(spaceRow.rule == 4)
        spLine = 7/6 * spaceRow.gap/2;    //em
    else
        spLine = 7/6;

    var lineGap;

    if(spaceRow.rule == 3)
        lineGap = spLine*g_dKoef_pt_to_mm;                           //pt
    else
        lineGap = spLine*FontSize*g_dKoef_pt_to_mm; //em


    var min = spaceRow.minGap*FontSize*g_dKoef_pt_to_mm;
    lineGap = Math.max(lineGap, min);

    return lineGap;
};

/**
 *
 * @param props
 * @constructor
 * @extends {CMatrixBase}
 */
function CMathMatrix(props)
{
    CMathMatrix.superclass.constructor.call(this);

	this.Id = g_oIdCounter.Get_NewId();

    this.Pr = new CMathMatrixPr();

    this.spaceRow    = null;
    this.spaceColumn = null;
    this.gaps        = null;

    this.column     = 0;

    this.setDefaultSpace();

    if(props !== null && props !== undefined)
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CMathMatrix, CMatrixBase);

CMathMatrix.prototype.ClassType = historyitem_type_matrix;
CMathMatrix.prototype.kind      = MATH_MATRIX;

CMathMatrix.prototype.init = function(props)
{
    this.setProperties(props);
    this.column = this.Pr.Get_ColumnsCount();

    var nRowsCount = this.getRowsCount();
    var nColsCount = this.getColsCount();

    this.Fill_LogicalContent(nRowsCount * nColsCount);

    this.fillContent();
};
CMathMatrix.prototype.setPosition = function(pos, PosInfo)
{
    this.pos.x = pos.x;

    if(this.bInside === true)
        this.pos.y = pos.y;
    else
        this.pos.y = pos.y - this.size.ascent; ///!!!!

    this.UpdatePosBound(pos, PosInfo);

    var maxWH = this.getWidthsHeights();
    var Widths = maxWH.widths;
    var Heights = maxWH.heights;

    var NewPos = new CMathPosition();

    var h = 0, w = 0;

    for(var i=0; i < this.nRow; i++)
    {
        w = 0;
        for(var j = 0; j < this.nCol; j++)
        {
            var Item = this.elements[i][j];
            var al = this.align(i, j);
            NewPos.x = this.pos.x + this.GapLeft + al.x + w;
            NewPos.y = this.pos.y + al.y + h + Item.size.ascent;

            Item.setPosition(NewPos, PosInfo);
            w += Widths[j] + this.gaps.column[j];
        }
        h += Heights[i] + this.gaps.row[i];
    }

    pos.x += this.size.width;
};
CMathMatrix.prototype.getMetrics = function(RPI)
{
    var Ascents = [];
    var Descents = [];
    var Widths = [];

    for(var i=0; i < this.nRow; i++)
    {
        Ascents[i]  = 0;
        Descents[i] = 0;

        for(var j = 0; j < this.nCol ; j++)
        {
            var size = this.elements[i][j].size;
            Widths[j]   = i > 0  && ( Widths[j] > size.width ) ? Widths[j] : size.width;
            Ascents[i]  = (Ascents[i] > size.ascent ) ? Ascents[i] : size.ascent;
            Descents[i] = (Descents[i] > size.height - size.ascent ) ? Descents[i] : size.height - size.ascent;
        }
    }

    return {ascents: Ascents, descents: Descents, widths: Widths}
};
CMathMatrix.prototype.setRowGapRule = function(rule, gap)
{
    this.spaceRow.rule = rule;
    this.spaceRow.gap = gap;
};
CMathMatrix.prototype.setColumnGapRule = function(rule, gap, minGap)
{
    this.spaceColumn.rule = rule;
    this.spaceColumn.gap = gap;
    if(minGap !== null && minGap !== undefined)
        this.spaceColumn.minGap = minGap;
};
CMathMatrix.prototype.getContentElement = function(nRowIndex, nColIndex)
{
    return this.Content[nRowIndex * this.getColsCount() + nColIndex];
};
CMathMatrix.prototype.fillContent = function()
{
    this.column = this.Pr.Get_ColumnsCount();

    var nRowsCount = this.getRowsCount();
    var nColsCount = this.getColsCount();

    this.setDimension(nRowsCount, nColsCount);

    for(var nRowIndex = 0; nRowIndex < nRowsCount; nRowIndex++)
    {
        for (var nColIndex = 0; nColIndex < nColsCount; nColIndex++)
        {
            this.elements[nRowIndex][nColIndex] = this.getContentElement(nRowIndex, nColIndex);
        }
    }
};
CMathMatrix.prototype.getRowsCount = function()
{
    return this.Pr.row;
};
CMathMatrix.prototype.getColsCount = function()
{
    return this.column;
};
CMathMatrix.prototype.Document_UpdateInterfaceState = function(MathProps)
{
    MathProps.Type = c_oAscMathInterfaceType.Matrix;
    MathProps.Pr   = null;
};


function CMathPoint()
{
    this.even = -1;
    this.odd  = -1;
}

function CMathEqArrPr()
{
    this.maxDist = 0;
    this.objDist = 0;
    this.rSp     = 0;
    this.rSpRule = 0;
    this.baseJc  = BASEJC_CENTER;

    this.row     = 1;
}

CMathEqArrPr.prototype.Set_FromObject = function(Obj)
{
    if(undefined !== Obj.maxDist && null !== Obj.maxDist)
        this.maxDist = Obj.maxDist;

    if(undefined !== Obj.objDist && null !== Obj.objDist)
        this.objDist = Obj.objDist;

    if(undefined !== Obj.rSp && null !== Obj.rSp)
        this.rSp = Obj.rSp;

    if(undefined !== Obj.rSpRule && null !== Obj.rSpRule)
        this.rSpRule = Obj.rSpRule;

    if(undefined !== Obj.baseJc && null !== Obj.baseJc)
        this.baseJc = Obj.baseJc;

    this.row = Obj.row;
};

CMathEqArrPr.prototype.Copy = function()
{
    var NewPr = new CMathEqArrPr();

    NewPr.maxDist = this.maxDist;
    NewPr.objDist = this.objDist;
    NewPr.rSp     = this.rSp    ;
    NewPr.rSpRule = this.rSpRule;
    NewPr.baseJc  = this.baseJc ;
    NewPr.row     = this.row;

    return NewPr;
};

CMathEqArrPr.prototype.Write_ToBinary = function(Writer)
{
    // Long : maxDist
    // Long : objDist
    // Long : rSp
    // Long : rSpRule
    // Long : baseJc
    // Long : row

    Writer.WriteLong(this.maxDist);
    Writer.WriteLong(this.objDist);
    Writer.WriteLong(this.rSp);
    Writer.WriteLong(this.rSpRule);
    Writer.WriteLong(this.baseJc);
    Writer.WriteLong(this.row);
};

CMathEqArrPr.prototype.Read_FromBinary = function(Reader)
{
    // Long : maxDist
    // Long : objDist
    // Long : rSp
    // Long : rSpRule
    // Long : baseJc
    // Long : row

    this.maxDist = Reader.GetLong();
    this.objDist = Reader.GetLong();
    this.rSp     = Reader.GetLong();
    this.rSpRule = Reader.GetLong();
    this.baseJc  = Reader.GetLong();
    this.row     = Reader.GetLong();
};


/**
 *
 * @param props
 * @constructor
 * @extends {CMatrixBase}
 */
function CEqArray(props)
{
    CEqArray.superclass.constructor.call(this);

	this.Id = g_oIdCounter.Get_NewId();

    this.Pr = new CMathEqArrPr();

    this.spaceRow    = null;
    this.spaceColumn = null;
    this.gaps        = null;

    this.setDefaultSpace();

    // for ampersand in Run
    this.WidthsPoints = [];
    this.Points       = [];
    this.MaxDimWidths = [];
    //

    if(props !== null && props !== undefined)
        this.init(props);

	g_oTableId.Add( this, this.Id );
}
Asc.extendClass(CEqArray, CMatrixBase);

CEqArray.prototype.ClassType = historyitem_type_eqArr;
CEqArray.prototype.kind      = MATH_EQ_ARRAY;

CEqArray.prototype.init = function(props)
{
    var nRowsCount = props.row;

    this.Fill_LogicalContent(nRowsCount);

    this.setProperties(props);
    this.fillContent();
};
CEqArray.prototype.addRow = function()
{
    var NewContent = new CMathContent();
    this.protected_AddToContent(this.CurPos + 1, [NewContent], true);
    this.CurPos++;

    var NewPr = this.Pr.Copy();
    NewPr.row = this.Content.length;
    this.setPr(NewPr);

    return NewContent;
};
CEqArray.prototype.setPr = function(NewPr)
{
    History.Add(this, new CChangesMathEqArrayPr(NewPr, this.Pr));
    this.raw_SetPr(NewPr);
};
CEqArray.prototype.raw_SetPr = function(NewPr)
{
    this.Pr = NewPr;
};
CEqArray.prototype.fillContent = function()
{
    var nRowsCount = this.Content.length;
    this.setDimension(nRowsCount, 1);

    for (var nIndex = 0; nIndex < nRowsCount; nIndex++)
        this.elements[nIndex][0] = this.Content[nIndex];
};
CEqArray.prototype.Resize = function(oMeasure, RPI)
{
    // на случай, чтобы не затереть массив
    //var CurrAmperWPoints = RPI.AmperWPoints,
    //    CurrEqArray     = RPI.bEqArray;

    var NewRPI = RPI.Copy();
    NewRPI.bEqArray = true;

    for(var i = 0; i < this.nRow; i++)
        this.elements[i][0].Resize(oMeasure, NewRPI);

    this.recalculateSize(oMeasure);
};
CEqArray.prototype.getMetrics = function()
{
    var AscentsMetrics = [];
    var DescentsMetrics = [];
    var WidthsMetrics = [];

    // нумерация начинается с нуля, поэтому все четные точки идут с нечетными номерами в массиве

    //var lngW = RPI.Widths.length; // this.nRow
    var EndWidths = 0;

    var even, // четная точка
        odd,  // нечетная точка
        last;

    var maxDim, maxDimWidth;

    var Pos = 0;

    this.WidthsPoints.length = 0;
    this.Points.length       = 0;
    this.MaxDimWidths.length = 0;

    WidthsMetrics[0] = 0;

    while(EndWidths < this.nRow)
    {
        even = 0;
        odd  = 0;
        last = 0;

        maxDim = 0;
        maxDimWidth = 0;

        for(var i = 0; i < this.nRow; i++)
        {
            var WidthsRow = this.elements[i][0].Get_WidthPoints().Widths,
                len = WidthsRow.length;

            if(Pos < len)
            {
                if(WidthsRow[Pos].odd !== -1)
                {
                    if(maxDim < WidthsRow[Pos].even || maxDim < WidthsRow[Pos].odd)
                    {
                        maxDim = WidthsRow[Pos].even < WidthsRow[Pos].odd ? WidthsRow[Pos].odd : WidthsRow[Pos].even;
                        maxDimWidth = WidthsRow[Pos].even + WidthsRow[Pos].odd;
                    }
                    even = even > WidthsRow[Pos].even  ? even : WidthsRow[Pos].even;  // before "odd"
                    odd  = odd  > WidthsRow[Pos].odd   ? odd  : WidthsRow[Pos].odd;   // after  "odd"
                }
                else
                {
                    if(maxDim < WidthsRow[Pos].even)
                    {
                        maxDim = WidthsRow[Pos].even;
                        maxDimWidth = maxDim;
                    }
                    last = last > WidthsRow[Pos].even ? last: WidthsRow[Pos].even;
                }

                if(Pos == len - 1)
                    EndWidths++;
            }
        }

        var w = even + odd > last ? even + odd : last;

        var NewPoint = new CMathPoint();
        NewPoint.even   = even;
        NewPoint.odd    = odd;

        this.WidthsPoints.push(w);
        this.MaxDimWidths.push(maxDimWidth);
        this.Points.push(NewPoint);

        WidthsMetrics[0] += w;

        Pos++;
    }

    for(var i = 0; i < this.nRow; i++)
        this.elements[i][0].ApplyPoints(this.WidthsPoints, this.Points, this.MaxDimWidths);


    for(var i = 0; i < this.nRow; i++)
    {
        var size = this.elements[i][0].size;
        AscentsMetrics[i]  = size.ascent;
        DescentsMetrics[i] = size.height - size.ascent;
    }

    return {ascents: AscentsMetrics, descents: DescentsMetrics, widths: WidthsMetrics};
};
CEqArray.prototype.setPosition = function(pos, PosInfo)
{
    this.pos.x = pos.x;

    if(this.bInside === true)
        this.pos.y = pos.y;
    else
        this.pos.y = pos.y - this.size.ascent; ///!!!!

    this.UpdatePosBound(pos, PosInfo);

    var maxWH = this.getWidthsHeights();
    var Heights = maxWH.heights;

    var NewPos = new CMathPosition();

    var h = 0;

    for(var i=0; i < this.nRow; i++)
    {
        var Item = this.elements[i][0];
        NewPos.x = this.pos.x + this.GapLeft;
        NewPos.y = this.pos.y + h + Item.size.ascent;

        Item.setPosition(NewPos, PosInfo);

        h += Heights[i] + this.gaps.row[i];
    }

    pos.x += this.size.width;
};
CEqArray.prototype.setJustificationForConversion = function(js) // эта функция должна вызываться только при конвертации, после того как у всех элементов контенты заполнены
{
    var lng = this.Content.length;
    var NewElement, Run;

    if(js == MCJC_LEFT)
    {
        for(var i = 0; i < lng; i++)
        {
            NewElement = new CMathAmp();
            Run = this.Content[i].Content[0];
            Run.Cursor_MoveToStartPos();
            Run.Add(NewElement, true);
        }
    }
    else if(js == MCJC_RIGHT)
    {
        for(var i = 0; i < lng; i++)
        {
            NewElement = new CMathAmp();
            var EndPos = this.Content[i].Content.length - 1;
            Run = this.Content[i].Content[EndPos];
            Run.Cursor_MoveToEndPos();
            Run.Add(NewElement, true);
        }
    }

};
CEqArray.prototype.getElement = function(num)
{
    return this.elements[num][0];
};
CEqArray.prototype.getElementMathContent = function(Index)
{
    return this.Content[Index];
};
CEqArray.prototype.Document_UpdateInterfaceState = function(MathProps)
{
    MathProps.Type = c_oAscMathInterfaceType.EqArray;
    MathProps.Pr   = null;
};
CEqArray.prototype.IsEqArray = function()
{
    return true;
};

