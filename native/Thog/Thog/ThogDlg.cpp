#include "stdafx.h"
#include "thog.h"
#include "thogDlg.h"
#include "thogCLientThread.h"
#include "DownloadRequest.h"
#include "afxdialogex.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif

// CThogDlg dialog

CThogDlg::CThogDlg(CWnd* pParent /*=NULL*/) : CDialogEx(CThogDlg::IDD, pParent)
{
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);

	m_pClientThread = nullptr;

	m_requestData = "";
	m_statusCode = 0;

	m_baseUrl = "http://192.168.160.44:1337/";

	m_baseUrl = "http://localhost:1337/";
}

CThogDlg::~CThogDlg()
{
}

void CThogDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);
	DDX_Text(pDX, IDC_EDIT2, m_requestData);
	DDX_Text(pDX, IDC_EDIT3, m_statusCode);
	DDX_Text(pDX, IDC_EDIT4, m_payloadData);
	DDX_Control(pDX, IDC_COMBO1, m_ctlMethodCombo);
	DDX_Control(pDX, IDC_COMBO2, m_ctlCmdCombo);
}

BEGIN_MESSAGE_MAP(CThogDlg, CDialogEx)
	ON_WM_PAINT()
	ON_WM_QUERYDRAGICON()
	ON_BN_CLICKED(IDC_BUTTON1, OnSend)
	ON_MESSAGE(WM_MSG, OnMsgSent)
	ON_WM_DESTROY()
	ON_CBN_SELCHANGE(IDC_COMBO2, &CThogDlg::OnChangeRequest)
END_MESSAGE_MAP()

// CThogDlg message handlers

BOOL CThogDlg::OnInitDialog()
{
	CDialogEx::OnInitDialog();

	// Set the icon for this dialog.  The framework does this automatically
	//  when the application's main window is not a dialog
	SetIcon(m_hIcon, TRUE);			// Set big icon
	SetIcon(m_hIcon, FALSE);		// Set small icon

	m_ctlCmdCombo.AddString("api/services");
	m_ctlCmdCombo.AddString("api/services?complete=true");
	m_ctlCmdCombo.AddString("api/services/sarIncident");
	m_ctlCmdCombo.AddString("api/services/sarIncident/config");
	m_ctlCmdCombo.AddString("api/services/jack");
	m_ctlCmdCombo.AddString("api/services/jack/register");
	m_ctlCmdCombo.AddString("api/services/jack/off");
	m_ctlCmdCombo.AddString("api/services/jack/off/register");

	m_ctlCmdCombo.AddString("api/admin/register");
	m_ctlCmdCombo.AddString("api/admin/reset");
	//m_ctlCmdCombo.AddString("api/admin/poll?key=vans");
	m_ctlCmdCombo.AddString("api/admin/message?key=vans");

	m_ctlCmdCombo.SetCurSel(0);

	m_pClientThread = new CThogClientThread(this);
	m_pClientThread->CreateThread();

	char* szMethods[] = { "GET", "POST", "DELETE", "PUT" };

	int nMethods = sizeof(szMethods) / sizeof(char *);

	m_payloadData = "{\"description\":\"C++ Test\",\"name\":\"Test 3\",\"post\":{\"sex\":true,\"poop\":\"runny\"}}";

	for (int i = 0; i < nMethods; i++)
	{
		m_ctlMethodCombo.AddString(szMethods[i]);
	}

	m_ctlMethodCombo.SetCurSel(0);

	UpdateData(FALSE);
		
	return TRUE;  // return TRUE  unless you set the focus to a control
}

LRESULT CThogDlg::OnMsgSent(WPARAM nMessage, LPARAM)
{
	CRequestResult* pData = m_pClientThread->GetRequestData(nMessage);

	m_statusCode = pData->m_status;

	m_requestData = pData->m_data;


	rapidjson::Document document;

	if (document.Parse(m_requestData).HasParseError())
	{
		AfxMessageBox("error");
	}
	else
	{
		m_payloadData = "";
		RecurseNode(document, "");
	}
	   
	m_requestData.Replace("\n", "\r\n");

	UpdateData(FALSE);

	return TRUE;
}

// If you add a minimize button to your dialog, you will need the code below
//  to draw the icon.  For MFC applications using the document/view model,
//  this is automatically done for you by the framework.

void CThogDlg::OnPaint()
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
HCURSOR CThogDlg::OnQueryDragIcon()
{
	return static_cast<HCURSOR>(m_hIcon);
}

void CThogDlg::OnSend()
{
	UpdateData();

	int nMethod = m_ctlMethodCombo.GetCurSel();

	int nCurCmd = m_ctlCmdCombo.GetCurSel();

	CString szCmd;
	m_ctlCmdCombo.GetWindowText(szCmd);

	CDownloadRequest* pReq = new CDownloadRequest;

	pReq->m_url = m_baseUrl + szCmd;

	switch (nMethod)
	{
	case 0:
		pReq->m_nVerb = CHttpConnection::HTTP_VERB_GET;
		break;
	case 1:
		pReq->m_nVerb = CHttpConnection::HTTP_VERB_POST;
		pReq->m_payload = m_payloadData;
		break;
	case 2:
		pReq->m_nVerb = CHttpConnection::HTTP_VERB_DELETE;
		pReq->m_payload = m_payloadData;
		break;
	case 3:
		pReq->m_nVerb = CHttpConnection::HTTP_VERB_PUT;
		pReq->m_payload = m_payloadData;
		break;
	}
		
	m_pClientThread->AddDownloadRequest(pReq);
}

void CThogDlg::OnDestroy()
{
	m_pClientThread->m_bRunning = false;

	::WaitForSingleObject(m_pClientThread->m_hThread, INFINITE);

	delete m_pClientThread;

	CDialogEx::OnDestroy();
}

void CThogDlg::OnOK()
{
	OnSend();
}

void CThogDlg::RecurseNode(const rapidjson::Value &node, CString name, int nLevel)
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
		m_payloadData += fmt;

		for (rapidjson::Value::ConstMemberIterator childNode = node.MemberBegin(); childNode != node.MemberEnd(); ++childNode)
		{
			RecurseNode(childNode->value, childNode->name.GetString(), nLevel + 1);
		}
		break;
	case rapidjson::kArrayType:
		valFmt.Format("Array");

		fmt.Format("%*s[%s] = %s\r\n", nLevel * 2, "", name, valFmt);
		m_payloadData += fmt;

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
		m_payloadData += fmt;
	}
}

void CThogDlg::CreateJSON(void)
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

	m_payloadData = strbuf.GetString();

	UpdateData(FALSE);
}

void CThogDlg::OnChangeRequest()
{
	CreateJSON();
}
