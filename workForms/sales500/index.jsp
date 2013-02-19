<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>
<%@ page contentType="text/javascript" %>
<%
  String formData;
  if (request.getParameter("output") == null) {
    formData = "";
  } else {
    formData = request.getParameter("output");
  }

  String nameOfFile = "/apache-tomcat-5.5.27/webapps/portal/sales500/sales.json";
  try {
    PrintWriter pw = new PrintWriter(new FileOutputStream(nameOfFile));
    pw.println(formData);
    pw.close();
  } catch(IOException e) {
    out.println(e.getMessage());
  }
%>
