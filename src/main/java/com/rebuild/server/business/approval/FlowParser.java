/*
rebuild - Building your business-systems freely.
Copyright (C) 2019 devezhao <zhaofang123@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

package com.rebuild.server.business.approval;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

/**
 * 流程解析
 * 
 * @author devezhao-mbp zhaofang123@gmail.com
 * @since 2019/07/06
 */
public class FlowParser {

	final private JSON flowDefinition;
	
	private Map<String, FlowNode> nodeMap = new HashMap<>();
	
	/**
	 * @param flowDefinition
	 */
	public FlowParser(JSON flowDefinition) {
		this.flowDefinition = flowDefinition;
		preparedNodes(((JSONObject) flowDefinition).getJSONArray("nodes"), null);
	}
	
	/**
	 * @param nodes
	 * @param ownBranch
	 */
	private void preparedNodes(JSONArray nodes, FlowBranch ownBranch) {
		String prevNode = null;
		if (ownBranch != null) {
			prevNode = ownBranch.getNodeId();
		}
		
		for (Object o : nodes) {
			// 节点
			JSONObject node = (JSONObject) o;
			String nodeId = node.getString("nodeId");
			if (!FlowNode.TYPE_CONDITION.equals(node.getString("type"))) {
				FlowNode flowNode = FlowNode.valueOf(node);
				if (prevNode != null) {
					flowNode.prevNodes = prevNode;
				}
				prevNode = nodeId;
				nodeMap.put(nodeId, flowNode);
				
				if (ownBranch != null) {
					ownBranch.addNode(flowNode);
				}
			}
			
			// 分支
			JSONArray branches = node.getJSONArray("branches");
			if (branches != null) {
				Set<String> prevNodes = new HashSet<>();
				for (Object b : branches) {
					JSONObject branch = (JSONObject) b;
					String branchNodeId = branch.getString("nodeId");
					FlowBranch flowBranch = FlowBranch.valueOf(branch);
					if (prevNode != null) {
						flowBranch.prevNodes = prevNode;
					}
					prevNodes.add(branchNodeId);
					nodeMap.put(branchNodeId, flowBranch);
					
					preparedNodes(branch.getJSONArray("nodes"), (FlowBranch) flowBranch);
				}
				prevNode = StringUtils.join(prevNodes, "|");
			}
		}
	}

	/**
	 * @param nodeId
	 * @return
	 */
	public List<FlowNode> getNextNodes(String nodeId) {
		List<FlowNode> next = new ArrayList<>();
		for (FlowNode node : getAllNodes()) {
			if (node.prevNodes != null && node.prevNodes.contains(nodeId)) {
				next.add(node);
			}
		}
		
		if (next.isEmpty()) {
			return Collections.emptyList();
		}
		
		if (!FlowNode.TYPE_BRANCH.equals(next.get(0).getType())) {
			return next;
		}
		
		// 条件节点优先级排序
		Collections.sort(next, new Comparator<FlowNode>() {
			public int compare(FlowNode o1, FlowNode o2) {
				int p1 = ((FlowBranch) o1).getPriority();
				int p2 = ((FlowBranch) o2).getPriority();
				return p1 > p2 ? 1 : (p1 == p2 ? 0 : -1);
			}
		});
		return next;
	}

	/**
	 * @param nodeId
	 * @return
	 */
	public FlowNode getNode(String nodeId) {
		if (nodeMap.containsKey(nodeId)) {
			return nodeMap.get(nodeId);
		}
		throw new ApprovalException("无效节点 : " + nodeId);
	}
	
	/**
	 * @return
	 */
	protected Collection<FlowNode> getAllNodes() {
		return nodeMap.values();
	}
	
	/**
	 * @return
	 */
	protected JSON getFlowDefinition() {
		return flowDefinition;
	}
}
