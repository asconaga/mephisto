#include "pch.h"
#include "framework.h"
#include "JsonRapid.h"
#include "JsonRapidDlg.h"
#include "afxdialogex.h"

// based on https://github.com/Tencent/rapidjson/

#ifdef _DEBUG
#define new DEBUG_NEW
#endif

CJsonRapidDlg::CJsonRapidDlg(CWnd* pParent /*=nullptr*/) : CDialogEx(IDD_JSONRAPID_DIALOG, pParent)
{
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);
	m_szOutput = "";
}

void CJsonRapidDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);
	DDX_Text(pDX, IDC_EDIT1, m_szOutput);
}

BEGIN_MESSAGE_MAP(CJsonRapidDlg, CDialogEx)
	ON_WM_PAINT()
	ON_WM_QUERYDRAGICON()
	ON_BN_CLICKED(IDC_BUTTON1, &CJsonRapidDlg::OnCreateJSON)
END_MESSAGE_MAP()


// CJsonRapidDlg message handlers

BOOL CJsonRapidDlg::OnInitDialog()
{
	CDialogEx::OnInitDialog();

	// Set the icon for this dialog.  The framework does this automatically
	//  when the application's main window is not a dialog
	SetIcon(m_hIcon, TRUE);			// Set big icon
	SetIcon(m_hIcon, FALSE);		// Set small icon

	//const char json[] = " { \"hello\" : \"world\", \"t\" : true , \"f\" : false, \"n\": null, \"i\":123, \"pi\": 3.1416, \"a\":[1, 2, 3, 4] } ";

	//const char json[] = "{ \"incident\":{\"id\":21012, \"name\" : \"Thailand Test 1\", \"modelId\" : 1, \"notes\" : \"MRCC received information\", \"userName\" : \"Ian Smith\", \"times\" : {\"driftStart\":1550466000, \"datum\" : 1550487600}, \"position\" : {\"lat\":12.65, \"lon\" : 100.8}, \"targets\" : {\"target\":{\"id\":45871325, \"name\" : \"Alpha Bravo\", \"type\" : 7}}} }";
	const char json[] = "{\"root\":{\"incident\":{\"id\":21012,\"name\":\"Thailand Test 1\",\"modelId\":1,\"notes\":\"MRCC received information\",\"userName\":\"Ian Smith\",\"times\":{\"driftStart\":1550466000,\"datum\":1550487600},\"position\":{\"lat\":12.65,\"lon\":100.8},\"targets\":{\"target\":[{\"id\":45871325,\"name\":\"Alpha Bravo\",\"type\":7},{\"id\":45871325,\"name\":\"Alpha Bravo\",\"type\":7}]}}}}";

	rapidjson::Document document;

	if (document.Parse(json).HasParseError())
	{
		AfxMessageBox("error");
	}
	else
	{
		m_szOutput = "";

		RecurseNode(document, "");
	}

	UpdateData(FALSE);

	return TRUE;  // return TRUE  unless you set the focus to a control
}

// If you add a minimize button to your dialog, you will need the code below
//  to draw the icon.  For MFC applications using the document/view model,
//  this is automatically done for you by the framework.

void CJsonRapidDlg::OnPaint()
{
	if (IsIconic())
	{
		CPaintDC dc(this); // device context for painting

		SendMessage(WM_ICONERASEBKGND, reinterpret_cast<WPARAM>(dc.GetSafeHdc()), 0);

		// Center icon in client rectangle
		int cxIcon = GetSystemMetrics(SM_CXICON);
		int cyIcon = GetSystemMetrics(SM_CYICON);
		CRect rect;
		GetClientRect(&rect);
		int x = (rect.Width() - cxIcon + 1) / 2;
		int y = (rect.Height() - cyIcon + 1) / 2;

		// Draw the icon
		dc.DrawIcon(x, y, m_hIcon);
	}
	else
	{
		CDialogEx::OnPaint();
	}
}

// The system calls this function to obtain the cursor to display while the user drags
//  the minimized window.
HCURSOR CJsonRapidDlg::OnQueryDragIcon()
{
	return static_cast<HCURSOR>(m_hIcon);
}

void CJsonRapidDlg::RecurseNode(const rapidjson::Value &node, CString name, int nLevel)
{
	CString fmt, valFmt;

	rapidjson::Type objType = node.GetType();

	valFmt = "";

	bool bDisp = true;

	switch (objType)
	{
	case rapidjson::kNullType:
		valFmt.Format("Null");
		break;
	case rapidjson::kFalseType:
		valFmt.Format("FALSE");
		break;
	case rapidjson::kTrueType:
		valFmt.Format("TRUE");
		break;
	case rapidjson::kObjectType:
		valFmt.Format("Object");

		bDisp = false;

		fmt.Format("%*s[%s] = %s\r\n", nLevel * 2, "", name, valFmt);
		m_szOutput += fmt;

		for (rapidjson::Value::ConstMemberIterator childNode = node.MemberBegin(); childNode != node.MemberEnd(); ++childNode)
		{
			RecurseNode(childNode->value, childNode->name.GetString(), nLevel + 1);
		}
		break;
	case rapidjson::kArrayType:
		valFmt.Format("Array");

		fmt.Format("%*s[%s] = %s\r\n", nLevel * 2, "", name, valFmt);
		m_szOutput += fmt;

		bDisp = false;

		for (rapidjson::SizeType i = 0; i < node.Size(); ++i)
		{
			fmt.Format("%d", i);
			RecurseNode(node[i], fmt, nLevel + 1);
		}

		break;
	case rapidjson::kNumberType:
		if (node.IsInt())
			valFmt.Format("%d", node.GetInt());
		else
			valFmt.Format("%g", node.GetDouble());
		break;
	case rapidjson::kStringType:
		valFmt.Format("String");
		valFmt.Format("'%s'", node.GetString());
		break;
	}

	if (bDisp)
	{
		fmt.Format("%*s[%s] = %s\r\n", nLevel * 2, "", name, valFmt);
		m_szOutput += fmt;
	}
}

void CJsonRapidDlg::OnCreateJSON(void)
{
	rapidjson::Document document;
	document.SetObject();

	rapidjson::Document::AllocatorType& docAllocator = document.GetAllocator();

	// Below code shoud be swapped for a more dynamic method
	// {

	struct User
	{
		int id;
		CString username;
		CString email;
	};

	const int nUsers = 2;

	User users[nUsers];

	users[0].id = 0;
	users[0].username = "Shane";
	users[0].email = "shane@fakeprovider.com";

	users[1].id = 1;
	users[1].username = "Ian";
	users[1].email = "ian@fakeprovider.com";

	rapidjson::Value valUserArray(rapidjson::Type::kArrayType);

	rapidjson::Value valUsers(rapidjson::Type::kObjectType);
	
	// Search users and create JSON format string
	for (int iUser = 0; iUser < nUsers; iUser++)
	{
		rapidjson::Value valUser(rapidjson::Type::kObjectType);

		//	Add members to object
		valUser.AddMember("id", rapidjson::Value::GenericValue(users[iUser].id + 1), docAllocator);

		valUser.AddMember("username", rapidjson::Value::StringRefType(users[iUser].username), docAllocator);

		valUser.AddMember("email", rapidjson::Value::StringRefType(users[iUser].email), docAllocator);

		//	Add object to JSON object array
		valUserArray.PushBack(valUser, docAllocator);
	}

	valUsers.AddMember("user", valUserArray, docAllocator);	//	Add array to document

	document.AddMember("users", valUsers, docAllocator);

	//	Convert JSON document to string

	rapidjson::StringBuffer strbuf;

	rapidjson::Writer<rapidjson::StringBuffer> writer(strbuf);

	document.Accept(writer);

	m_szOutput = strbuf.GetString();

	UpdateData(FALSE);
}
