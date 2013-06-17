<table>
<tr>
  <th> Feature\Database</th>

  <th>tacodb/level</th>
    <th>mongo</th>
      <th>couch</th>
        <th>redis</th>
          <th>MySql</th>
</tr>
<tr>
  <th> key-value </th>

    <td> yes </td>
      <td> yes </td>
        <td> yes </td>
          <td> yes </td>
            <td> no </td>
</tr>
<tr>
  <th> Range Queries </th>
    <td> yes </td>
      <td> yes </td>
        <td> pouch </td>
          <td> yes </td>
            <td> yes <td>
</tr>
<tr>
  <th> Update Notifications? </th>
   <td> yes </td>
     <td> no </td>
       <td> _changes feed </td>
         <td> pub/sub </td>
           <td> triggers </td>
</tr>
<tr>
  <th> Internal Format </th>
    <td> binary/configurable </td>
      <td> BSON </td>
        <td> JSON </td>
          <td> binary/text </td>
            <td> typed </td>
</tr>
<tr>
  <th> Runs on Web? </th>
    <td> yes </td>
      <td> no </td>
        <td> yes </td>
          <td> no </td>
            <td> no </td>
</tr>
<tr>
  <th> Runs on Mobile? </th>
    <td> on phonegap & mobile browser </td>
      <td> no </td>
        <td> pouch </td>
          <td> no </td>
            <td> no </td>
</tr>
<tr>
  <th> Schema/Validation </th>
    <td> via plugin </td>
      <td> no </td>
        <td> yes </td>
          <td> no </td>
            <td> yes </td>
</tr>
<tr>
  <th> RESTful/Http Interface </th>
    <td> via plugin </td>
      <td> no </td>
        <td> yes </td>
          <td> no  </td>
            <td> no </td>
</tr>
<tr>
  <th> Streaming/WebSockets </th>
    <td> yes </td>
      <td> no </td>
        <td> no </td>
          <td> no </td>
            <td> no </td>
</tr>
<tr>
  <th> Graph/Recursive Queries </th>
    <td> via plugin </td>
      <td> no </td>
        <td> no </td>
          <td> no </td>
            <td> no </td>
</tr>
<tr>
  <th> Full Text Index </th>
    <td> via plugin </td>
      <td> yes </td>
        <td> no </td>
          <td> no </td>
            <td> yes </td>
</tr>
<tr>
  <th> Pluggable? </th>
    <td> Yes! </td>
      <td> no </td>
        <td> no </td>
          <td> no </td>
            <td> no </td>
</tr>
<tr>
  <th> master-slave replication </th>
    <td> via plugin </td>
      <td> yes </td>
        <td> no </td>
          <td> yes </td>
            <td> yes </td>
</tr>
<tr>
  <th> master-master replication </th>
    <td> via plugin </td>
      <td> no </td>
        <td> yes </td>
          <td> no </td>
            <td> yes </td>
</tr>
</table>

